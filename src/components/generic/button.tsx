import NewTabIcon from "../../images/vectors/open-in-new.svg"

interface ButtonProps {
    link: string;
    children: any;
    class?: string;
}

const defaultClasses = "bg-primary-500 hover:bg-primary-700 text-neutral-50 font-sans text-center text-base py-3 px-12 rounded-3xl w-fit";
function Button(props: ButtonProps) {
    return (
        <a href={props.link} className={`${defaultClasses} ${props.class || ""}`}>
            {props.children}
        </a>
    )
}

function ExternalButton(props: ButtonProps) {
    return (
        <a href={props.link} target="_blank" rel="noopener noreferrer" className={`${defaultClasses} flex underline underline-offset-4 items-center w-fit ${props.class || ""}`}>
            {props.children}
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" /></svg>
        </a>
    )
};

export { Button, ExternalButton };
export default Button;