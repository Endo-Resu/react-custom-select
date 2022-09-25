import Select, {SelectOption} from "./Select/Select";
import {useState} from "react";

const options = [
    {label: "First", value: 1},
    {label: "Second", value: 2},
    {label: "Third", value: 3},
    {label: "Fourth", value: 4},
    {label: "Fifth", value: 5},
]

function App() {
    const [value, setValue] = useState<SelectOption | undefined>(options[0]);
    const [values, setValues] = useState<SelectOption[]>([options[0]]);

    return (
        <>
            <Select
                options={options}
                value={value}
                onChange={option => setValue(option)}
            />
            <br/>
            <Select
                multiple
                options={options}
                value={values}
                onChange={option => setValues(option)}
            />
        </>
    )
}

export default App
