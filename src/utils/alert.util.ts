
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import toast from "react-hot-toast";


export const successAlert = (message :string) => {
  //toast.success(message);

    toast.success(message, 
      {
      position: "bottom-center",
      style: {
        border: '1px solid #70AF85',
        padding: '2px',
        color: '#FFF',
        fontFamily:"VarelaRound-Regular",
        fontSize:'13px',
        fontWeight:600,
        letterSpacing: '0.5px',
        background: '#70AF85',
        borderColor:'#70AF85',
        borderWidth:'1px',
        borderRadius: '5px',
        marginBottom:'10px'
      },
      duration :3000,
      iconTheme: {
        primary: '#FFF',
        secondary: '#70AF85',
      },
    });
  }
  
  export const errorAlert = ( message :string) => {
   

    toast.error(message, 
      {
        position: "bottom-center",
        style: {
          border: '1px solid #EF4B4B',
          padding: '2px',
          color: '#FFF',
          fontFamily:"VarelaRound-Regular",
          fontSize:'13px',
          fontWeight:600,
          background: '#EF4B4B',
          borderColor:'#EF4B4B',
          borderWidth:'1px',
          letterSpacing: '0.5px',
          borderRadius: '5px',
          marginBottom:'10px'
        },
        duration :10000,
        iconTheme: {
          primary: '#FFF',
          secondary: '#e8635a',
        },
    });
  
  }
  
  export const infoAlert = (message :string) => {
    //toast.info(message)
    toast(message, 
      {
      position: "bottom-center",
      style: {
        border: '1px solid #82A0D8',
        padding: '2px',
        fontFamily:"VarelaRound-Regular",
        fontSize:'13px',
        letterSpacing: '0.5px',
        fontWeight:600,
        color: '#FFF',
        background: '#82A0D8',
        borderColor:'#82A0D8',
        borderWidth:'1px',
        borderRadius: '5px',
         marginBottom:'10px'
      },
      duration :7000,
      iconTheme: {
        primary: '#FFF',
        secondary: '#82A0D8',
      },
    });
  }

  