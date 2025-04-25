import React from 'react';
import { StyleSheet } from 'react-native';
import { Formik } from 'formik';

function AppForm({initialValues,handleSubmit,validationSchema,children}) {
    return (
        <Formik initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        >
            { () => (
            <>
                    {children}
            </>

            )}
            

    </Formik>
    );
}
const styles = StyleSheet.create({
    
})

export default AppForm;