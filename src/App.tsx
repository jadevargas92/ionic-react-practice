import { IonApp, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonRow, IonTitle, IonToolbar, IonAlert } from '@ionic/react';
import React, { useRef, useState } from 'react'
import BMIControls from './components/BMIControls';
import BMIResults from './components/BMIResults';
import InputControls from './components/InputControls';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';


const App: React.FC = () => {
  const [calculatedBMI, setCalculatedBMI] = useState<number>()
  const [error, setError] = useState<string>();
  const [calcUnits, setCalcUnits] = useState<'mkg' | 'ftlbs'>('mkg')
  // useRef() is a react hook
  // useRef<htmlion....>(null) is typescript.
  // Typescript gets mad if you don't define that the reference object is pointing to the input
  const weightInputRef = useRef<HTMLIonInputElement>(null)
  const heightInputRef = useRef<HTMLIonInputElement>(null)

  const calculateBMI = () => {
    const enteredWeight = weightInputRef.current!.value
    const enteredHeight = heightInputRef.current!.value

    if (!enteredHeight || !enteredWeight || +enteredWeight <= 0 || +enteredHeight <= 0) {
      setError('Please enter a valid (non-negative) input number')
      return;
    }

    const weightConversionFactor = calcUnits === 'ftlbs' ? 2.2 : 1;
    const heightConversionFactor = calcUnits === 'ftlbs' ? 3.28 : 1;

    const weight = +enteredWeight / weightConversionFactor;
    const height = +enteredHeight / heightConversionFactor;

    const bmi = weight / (height * height)

    setCalculatedBMI(bmi)
  }

  const resetInputs = () => {
    weightInputRef.current!.value = ""
    heightInputRef.current!.value = ""
  }

  const clearError = () => {
    setError('')
  }

  const selectCalcUnitHandler = (selectedValue: 'mkg' | 'ftlbs') => {
    setCalcUnits(selectedValue)
  }

  return (
    <React.Fragment>
      <IonAlert
        isOpen={!!error}
        message={error}
        buttons={[{ text: 'Okay', handler: clearError }]}
      />
      <IonApp>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>BMI Calculator</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonGrid>
            <IonRow>
              <IonCol>
                <InputControls selectedValue={calcUnits} onSelectedValue={selectCalcUnitHandler} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="floating">
                    Your Height ({calcUnits === 'mkg' ? 'meters' : 'feet'})
                  </IonLabel>
                  <IonInput type="number" ref={heightInputRef}></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="floating">
                    Your Weight ({calcUnits === 'mkg' ? 'kg' : 'lbs'})
                  </IonLabel>
                  <IonInput type="number" ref={weightInputRef}></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <BMIControls onCalculate={calculateBMI} onReset={resetInputs} />
            {calculatedBMI &&
              <BMIResults result={calculatedBMI} />
            }
          </IonGrid>
        </IonContent>
      </IonApp>
    </React.Fragment>
  )
};

export default App;
