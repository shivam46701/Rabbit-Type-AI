import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const location = useLocation();

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <span className="logo-icon">🐰</span>
                    <span className="logo-text">Rabbit<span className="text-gradient">Type</span></span>
                </Link>
            </div>
        </header>
    );
}
