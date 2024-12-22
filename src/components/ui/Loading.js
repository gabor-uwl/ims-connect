import { useEffect } from "react";



export default function LoadingComponent({timeOutHandler, message}) {
  useEffect( () => {
    setTimeout( () => {
      timeOutHandler(false);
    }, 1000);
  });

  return (
    <div>
      <h1 style={{fontFamily: "cursive", marginTop: "50px"}}>{message}</h1>
      <div className="spinner-border text-dark" 
           style={{width: "50px",height: "50px", marginTop: "50px"}}></div>
   </div>
  );
};