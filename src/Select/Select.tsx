import {FC, useEffect, useRef, useState} from "react";
import s from './Select.module.scss';

export type SelectOption = {
    label: string;
    value: string | number;
}

type MultipleSelectProps = {
    multiple: true;
    value: SelectOption[];
    onChange: (value: SelectOption[]) => void;
}

type SingleSelectProps = {
    multiple?: false;
    value?: SelectOption;
    onChange: (value: SelectOption | undefined) => void;
}

type SelectProps = {
    options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps)

const Select: FC<SelectProps> = ({multiple, options, value, onChange}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const clearOptions = () => {
        multiple ? onChange([]) : onChange(undefined)
    }

    const selectOption = (option: SelectOption) => {
        if (multiple) {
            if (value.includes(option)) {
                onChange(value.filter(o => o !== option))
            } else  {
                onChange([...value, option])
            }
        } else  {
            if (option !== value) {
                onChange(option)
            }
        }
    }

    const isOptionSelected = (option: SelectOption) => {
        return multiple ? value.includes(option) : option === value
    }

    useEffect(() => {
        if (isOpen) {
            setHighlightedIndex(0)
        }
    }, [isOpen])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) {
                return
            }
            switch (e.code) {
                case "Enter":
                case "Space":
                    setIsOpen(prevState => !prevState)
                    if (isOpen) {
                        selectOption(options[highlightedIndex])
                    }
                    break
                case "ArrowUp":
                case "ArrowDown": {
                    if (!isOpen) {
                        setIsOpen(true)
                        break
                    }

                    const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue)
                    }
                    break
                }
                case "Escape":
                    setIsOpen(false)
                    break
            }
        }
        containerRef.current?.addEventListener('keydown', handler)

        return () => {
            containerRef.current?.removeEventListener('keydown', handler)
        }
    }, [isOpen, highlightedIndex, options])

    return (
        <div
            ref={containerRef}
            className={s.container}
            tabIndex={0}
            onClick={() => setIsOpen(prevState => !prevState)}
            onBlur={() => setIsOpen(false)}
        >
            <span className={s.value}>
                {multiple
                    ?
                    value.map(v => (
                        <button
                            key={v.value}
                            onClick={e => {
                                e.stopPropagation()
                                selectOption(v)
                            }}
                            className={s.option_badge}
                        >
                            {v.label}
                            <span className={s.remove}>
                                &times;
                            </span>
                        </button>
                    ))
                    :
                    value?.label}
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