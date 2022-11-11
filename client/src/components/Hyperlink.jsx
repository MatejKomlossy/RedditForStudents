function Hyperlink({href, linkText}){

    return (
        <a
            href={href}
            className={"text-base font-light text-blue-500"}
        >
            {linkText}
        </a>
    )
}

export default Hyperlink;
