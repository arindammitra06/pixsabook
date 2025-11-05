
import { Dispatch, FC, SetStateAction } from "react";
export type LogoProps = {
    logoPath: string,
    alt: string,
    size: string;
    isClosed?:boolean;
    setIsButtonClicked? : Dispatch<SetStateAction<boolean>>;
    show?: boolean
};
   
  
export const AppLogo: FC<LogoProps> = ({logoPath,alt, size,show =true, isClosed, setIsButtonClicked}) => {
   
    return (<img src={logoPath} alt={alt} width={size} height={size} 
            style={{ display: show ? 'block' : 'none' }} />
        
)};

