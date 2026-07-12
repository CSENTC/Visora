import { Box } from "lucide-react"
import Button from "./ui/Button";
import { Link, useOutletContext } from "react-router";

const Navbar = () => {
    const handleAuthClick = async() => {
        if (isSignedIn) {
            try {
                await signOut();
            } catch (e) {
                console.error(`Puter sign out failed: ${e}`);
            }

            return;
        }

        try {
            await signIn();
        } catch (e) {
            console.error(`Puter sign in failed: ${e}`);
        }
    };
    const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>();
  return (
    <header className="navbar">
        <nav className="inner">
            <div className="left">
                <div className="brand">
                    <Box className="logo" />
                    <span className="name">
                        Visora
                    </span>
                </div>
                <ul className="links">
                    <a href="/">Product</a>
                    <Link to="/pricing">Pricing</Link>
                    <Link to="/community">Community</Link>
                    <Link to="/enterprise">Enterprise</Link>
                </ul>
            </div>
            <div className="actions">
                {isSignedIn ? (
                    <>
                        <span className="greeting">
                            {userName ? `Hi, ${userName}` : 'Signed In'}
                        </span>
                        <Button size="sm" onClick={handleAuthClick} className="btn">
                            Log out
                        </Button>
                    </>
                ) : ( 
                    <>
                        <Button 
                            onClick={handleAuthClick}
                            size="sm" variant="ghost">
                            Log In
                        </Button>
                        <a href="#upload" className="cta">Get Started</a>
                    </>   
                )}

            </div>
        </nav>
    </header>
  )
}

export default Navbar