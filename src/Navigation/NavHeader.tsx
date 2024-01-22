import { useNavigate } from 'react-router-dom';
import './NavHeader.scss';

// NavHeader
const NavHeader = (props: any) => {

    const navigate = useNavigate();

    return (
        <div className='NavHeader'>
            <p>LOGO</p>
            <h1 className='Title' onClick={() => navigate('/')}>Demo App</h1>
        </div>
    )
}

export default NavHeader;