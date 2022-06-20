import {useState} from 'react';

export default function useInputs(initialValue) {
    const [value, setValue] = useState(initialValue);
    const onChange = event => {
        console.log(event);
        setValue( 
            {
            ...value,
            [event.target.name] : event.target.value
            }
            );     
    };

    return [ value, onChange ];
}
