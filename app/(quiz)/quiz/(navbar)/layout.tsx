import Navbar from '@/components/navbar'
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, IconButton, MenuItem, Tab, Tabs, Toolbar} from '@mui/material'

const layout = ({children}: {children: React.ReactNode}) => {
    return (
        <Box>
            <Navbar></Navbar>
            {children}
        </Box>
    )
};

export default layout
