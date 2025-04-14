import { useEffect, useState } from "react";

interface UserRadioButtonsProps {
    handleChange: (userName: string|null) => void;
    userName: string|null;
}

export default function ({ handleChange, userName}: UserRadioButtonsProps){
    const [name1, setName1] = useState<string>("");
    const [name2, setName2] = useState<string>("");
    
    useEffect(() => {
        setName1(process.env.NEXT_PUBLIC_NAME1 || "");
        setName2(process.env.NEXT_PUBLIC_NAME2 || "");
      }, []);

    const handleRadioChange  = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userName = event.target.value;
        handleChange(userName);
    };

    const textStyle = {
    fontSize: '12px',
    color: 'black',
    padding: '10px',
    marginBottom: '30px',
    };
    
    const marginBottom = {
    marginBottom: '50px',
    };

    return (
        <div id="userRadioButtons" style={marginBottom}>
        <label style={textStyle}>
          <input type="radio" name="user" value={name1} onChange={handleRadioChange} /> {name1}
        </label>
        <label style={textStyle}>
          <input type="radio" name="user" value={name2} onChange={handleRadioChange} /> {name2}
        </label>
      </div>
    )
}