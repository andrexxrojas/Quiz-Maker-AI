import "../styles/navStyle.css";

function Nav({ onOpenModal }) {
    return (
        <>
            <nav>
                <div className="logo"></div>

                <ul>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); onOpenModal("login"); }}>Login</a>
                    </li>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); onOpenModal("register"); }}>Register</a>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Nav;