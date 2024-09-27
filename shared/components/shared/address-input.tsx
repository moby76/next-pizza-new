//поле ввода интегрированное с с сервисом dadata с помощью библиотеки react-dadata

'use client'

// import { useState } from 'react';
import { AddressSuggestions } from 'react-dadata';
import type { DaDataAddressBounds } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import { any, array } from 'zod';

interface Props {
    onChange?: (value?: string) => void

}

export const AddressInput = ({ onChange }: Props) => {

    //значения для найденного адреса
    // const [value, setValue] = useState()

    return (

        <AddressSuggestions
            token="4f2c2a95e0365b4d80ebf6e1941c70864e995f19"
            // value={value} 
            onChange={(data) => onChange?.(data?.value)}
            // filterLocations={[name: 'Кемеровская область - Кузбасс']}

            filterLocations={[{ region: 'Кемеровская область - Кузбасс' }]}
            filterFromBound='city'
            // filterToBound="house"
            renderOption={(AddressSuggestions) =>
                <div>
                    {AddressSuggestions.data.city} {AddressSuggestions.data.street_with_type} {AddressSuggestions.data.house} {AddressSuggestions.data.flat}
                </div>}
        />
    )
}

