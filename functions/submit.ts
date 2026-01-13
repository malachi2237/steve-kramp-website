import validator from 'validator'

function validateRequest(request: Request, targetDomain: string) {
    return request.headers.get("content-type") === "application/x-www-form-urlencoded" &&
        validator.isURL(request.url, {
            protocols: ['https'],
            host_whitelist: [targetDomain, "www." + targetDomain],
            allow_query_components: false
        }) &&
        validator.isURL(request.headers.get("origin") || "", {
            protocols: ['https'],
            host_whitelist: [targetDomain, "www." + targetDomain],
            allow_query_components: false
        }) &&
        validator.isURL(request.headers.get("host") || "", {
            protocols: ['https'],
            host_whitelist: [targetDomain, "www." + targetDomain],
            allow_query_components: false
        }) &&
        validator.isURL(request.headers.get("referer") || "", {
            protocols: ['https'],
            host_whitelist: [targetDomain, "www." + targetDomain],
            allow_query_components: false
        })
}

function sanitizeAndValidateForm(uFormData: FormData, expected: string[]) {
    let formLength = 0
    uFormData.forEach(() => formLength++)
    const lengthValid = formLength === expected.length
    const emailValid = typeof uFormData.get('email') === "string" && validator.isEmail(uFormData.get("email") as string)
    const nameValid = typeof uFormData.get('name') === "string" && !validator.isEmpty(uFormData.get("name") as string)

    const msg = uFormData.get("message")?.toString() || ""
    const msgLengthTest = (msg.length || 0) >= 10

    var msgSpaces = -1
    var lastSpace = 0
    while (lastSpace >= 0 && msgSpaces < 2) {
        lastSpace = msg.indexOf(" ", lastSpace)
        msgSpaces++;
    }
    const messageValid = msgLengthTest && msgSpaces >= 2
    if (
        lengthValid &&
        emailValid &&
        nameValid &&
        messageValid
    ) {
        const sFormData = new FormData()
        sFormData.set("name", validator.escape(uFormData.get("name") as string))
        sFormData.set("email", uFormData.get("email") || "")
        sFormData.set("message", validator.escape(uFormData.get("message") as string))
        return sFormData
    }
    console.log(
        `
        Valid length (${expected.length}): ${lengthValid}
        Valid email: ${emailValid}
        Valid name: ${nameValid}
        Valid message: ${messageValid}
        `
    )
    console.log(uFormData)
    return undefined
}

async function validateTurnstile(uForm: FormData, secretKey: string, ip: string | null) {
    const token: string = uForm.get('cf-turnstile-response')?.toString() || ""
    const formData = new FormData();
    formData.append('secret', secretKey)
    formData.append('response', token)
    formData.append('remoteip', ip || "")
    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData
        })
        return response.ok
    } catch (error) {
        console.error('Turnstile validation error:', error);
        return false
    }
}

export const onRequestPost: PagesFunction = async (ctx) => {
    const isLive = ctx.env.DEPLOY_TYPE === "live"
    const expected = [
        "name",
        "email",
        "message",
        "cf-turnstile-response"
    ]

    if (isLive && !validateRequest(ctx.request, ctx.env.domain)) {
        console.log(ctx.request)
        return new Response("Success!")
    }
    const uForm = await ctx.request.formData()
    const turnstileResponse = !isLive || validateTurnstile(uForm, ctx.env.TURNSTILE_SECRET_KEY, ctx.request.headers.get("CF-Connecting-IP"))
    const sForm = sanitizeAndValidateForm(uForm, expected)

    if (sForm && await turnstileResponse) {
        sForm.set("key", ctx.env.FORM_KEY)
    }
    else {
        console.log(sForm)
        return new Response('Success!')
    }

    const forwardedRequest = new Request(ctx.request.url, {
        method: 'POST',
        body: sForm,
    })

    return isLive ? await ctx.env.FORM_SUBMIT.fetch(forwardedRequest) : new Response("Form submission simulation success!")
}