import React from 'react';
import { useFormikContext } from 'formik';

import AppTextInput from './AppTextInput'
import ErrorDisplay from '../ErrorDisplay';
function AppFormField({ name, ...otherProps }) {
    const {handleChange, setFieldTouched, errors,touched} = useFormikContext()
    return (
        <>
             <AppTextInput 
                onBlur={()=>setFieldTouched(name)}
                onChangeText={handleChange(name)}  
                {...otherProps}
                />
             <ErrorDisplay error={errors[name]} visible={touched[name] } />
        </>
    );
}

export default AppFormField;