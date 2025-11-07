
import { FC, ReactNode } from "react";
interface LoginBgProps {
  children: ReactNode;
  isReset: boolean;
};




const LoginBgComponent: FC<LoginBgProps> = ({ children, isReset }: LoginBgProps) => {

  return (<div
    style={{
      backgroundImage: `url(${isReset ? '/assets/images/flat_bg.webp' : '/assets/images/login_bg.jpg'})`,
      minHeight: '80vh',
      backgroundSize: 'cover',
    }}>
    {children}
  </div>)

}

export default LoginBgComponent;
