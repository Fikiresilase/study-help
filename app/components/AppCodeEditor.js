import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
function AppCodeEditor({code, setCode}) {
    
    

  return (
    <SafeAreaView style={styles.container}>
     { setCode ? <CodeEditor
        style={styles.editor}
        language="javascript"
        syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
        showLineNumbers
        initialValue={code}
        onChange={(newCode) => setCode(newCode)}
        
      /> : <CodeEditor
      style={styles.editor}
      language="typescript"
      syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
      showLineNumbers
      initialValue={code}
    /> 
      }

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    container: {
     flex:1,
     marginBottom:'10',
     backgroundColor: '#000',
     overflow: 'scroll',
     borderRadius: 10,
    },
    editor: {
      minHeight:'100%',
      inputLineHeight: 20,
      highlighterLineHeight: 20,
      fontSize: 16,
     
       
      
    },
  });

export default AppCodeEditor;