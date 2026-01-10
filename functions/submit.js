import validator from 'validator'

function sanitizeAndValidateForm(uFormData) {
    const expected = [
        "name",
        "email",
        "message"
    ]


    if (
        uFormData.keys().length == expected.length &&
        validator.isAlpha(uFormData.get("route"), "-/") || uFormData.get("route") === "/" &&
        validator.isEmail(uFormData.get("email")) &&
        !validator.isEmpty(uFormData.get("name")) &&
        uFormData.get("message").length >= 5
    ) {
        const sFormData = new FormData()
        sFormData.append("route", uFormData.get("route"))
        sFormData.append("name", validator.escape(uFormData.get("name")))
        sFormData.append("email", uFormData.get("email"))
        sFormData.append("message", validator.escape(uFormData.get("message")))

        return sFormData
    }
    return undefined
}

export async function onRequestPost(ctx) {
    const uForm = await ctx.request.formData()
    const sForm = sanitizeAndValidateForm(uForm)
    if (sForm) {
        sForm.append("key", ctx.env.FORM_KEY)
    }
    else {
        return new Response('Form validation failed')
    }
    console.log(sForm)
    const forwardedRequest = new Request(ctx.request, { body: sForm })

    console.log(forwardedRequest)
    
    return await ctx.env.FORM_SUBMIT.fetch(forwardedRequest)
}