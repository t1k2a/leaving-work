import React, { useEffect, useState } from "react";
import { isStg } from '@/app/utility/checkEnvironment'
interface UserRadioButtonsProps {
    handleChange: (userName: string, userId: string) => void;
    // Reactの推奨パターンに従い、ブラウザのデフォルト動作に依存せず、コンポーネントの状態を明示的に制御するために追加
    selectedValue?: string | null;
}

export default function UserRadioButtons({ handleChange, selectedValue = null}: UserRadioButtonsProps): JSX.Element {
    const [name1, setName1] = useState<string>("");
    const [name2, setName2] = useState<string>("");
    const [userId1, setUserId1] = useState<string>("");
    const [userId2, setUserId2] = useState<string>("");
    
    useEffect(() => {
      // STG環境の時だけユーザー名を変更する
      let userName1: string = ''
      let userName2: string = ''
      if (isStg()) {
        userName1 = process.env.NEXT_PUBLIC_NAME_TEST1 || "テストユーザー1"
        userName2 = process.env.NEXT_PUBLIC_NAME_TEST2 || "テストユーザー2"
      } else {
        userName1 = process.env.NEXT_PUBLIC_NAME1 || "ユーザー1"
        userName2 = process.env.NEXT_PUBLIC_NAME2 || "ユーザー2"
      }

      setName1(userName1);
      setName2(userName2);
      setUserId1(process.env.NEXT_PUBLIC_USER_ID1 || "default_user_1");
      setUserId2(process.env.NEXT_PUBLIC_USER_ID2 || "default_user_2");
      }, []);

    const handleRadioChange  = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const userName: string = event.target.value;
        const userId: string = event.target.dataset.userId || "";
        handleChange(userName, userId);
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
              data-user-id={userId1}
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
                data-user-id={userId2}
                onChange={handleRadioChange}
                checked={selectedValue === name2}
              /> {name2}
            </label>
        )}
      </div>
    )
}