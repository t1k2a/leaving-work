import React, { useEffect, useState } from "react";

interface UserRadioButtonsProps {
    handleChange: (userName: string) => void;
    // Reactの推奨パターンに従い、ブラウザのデフォルト動作に依存せず、コンポーネントの状態を明示的に制御するために追加
    selectedValue?: string | null;
}

export default function UserRadioButtons({ handleChange, selectedValue = null}: UserRadioButtonsProps): JSX.Element {
    const [name1, setName1] = useState<string>("");
    const [name2, setName2] = useState<string>("");
    
    useEffect(() => {
        setName1(process.env.NEXT_PUBLIC_NAME1 || "");
        setName2(process.env.NEXT_PUBLIC_NAME2 || "");
      }, []);

    const handleRadioChange  = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const userName: string = event.target.value;
        handleChange(userName);
    };

    const textStyle: React.CSSProperties = {
    fontSize: '12px',
    color: 'black',
    padding: '10px',
    marginBottom: '30px',
    };
    
    const marginBottom: React.CSSProperties = {
    marginBottom: '50px',
    };

    return (
      <div id="userRadioButtons" style={marginBottom}>
        {name1 && (
          <label style={textStyle}>
            <input 
              type="radio" 
              name="user" 
              value={name1} 
              onChange={handleRadioChange}
              checked={selectedValue === name1}
            /> {name1}
          </label>
        )}
        {name2 && (
          <label style={textStyle}>
              <input 
                type="radio" 
                name="user" 
                value={name2} 
                onChange={handleRadioChange}
                checked={selectedValue === name2}
              /> {name2}
            </label>
        )}
      </div>
    )
}