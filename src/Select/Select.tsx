import {FC, useEffect, useState} from "react";
import s from './Select.module.scss';

type SelectOption = {
    label: string;
    value: string | number;
}

type SelectProps = {
    options: SelectOption[];
    value?: SelectOption;
    onChange: (value: SelectOption | undefined) => void;
}

const Select: FC<SelectProps> = ({options, value, onChange}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

    const clearOptions = () => {
        onChange(undefined)
    }

    const selectOption = (option: SelectOption) => {
        if (option !== value) {
            onChange(option)
        }
    }

    const isOptionSelected = (option: SelectOption) => {
        return option === value
    }

    useEffect(() => {
        if (isOpen) {
            setHighlightedIndex(0)
        }
    }, [isOpen])

    return (
        <div
            className={s.container}
            tabIndex={0}
            onClick={() => setIsOpen(prevState => !prevState)}
            onBlur={() => setIsOpen(false)}
        >
            <span className={s.value}>
                {value?.label}
            </span>
            <button
                className={s.clear}
                onClick={e => {
                    e.stopPropagation()
                    clearOptions()}}
            >
                &times;
            </button>
            <div className={s.divider}>

            </div>
            <div className={s.arrow}>

            </div>
            <ul className={`${s.options} ${isOpen ? s.show : null}`}>
                {options.map((option, index) => (
                    <li
                        key={option.value}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`${s.option} 
                                    ${isOptionSelected(option) ? s.selected : null}
                                    ${index === highlightedIndex ? s.highlighted : null}`}
                        onClick={e => {
                            e.stopPropagation()
                            selectOption(option)
                            setIsOpen(false)
                        }}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Select;
