export const createTracker = (trackerData) => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const state = getState();
        
        const fieldNames = [];
        for(let i = 1; i <= trackerData.fieldsCount; i++)
            fieldNames.push(`Field ${i}`);

        firestore.collection(`users/${state.firebase.auth.uid}/trackers`)
        .add({
            name: trackerData.name,
            createdAt: new Date(),
            lastUpdatedAt: 'Never',
            trackedDaysCount: 0,
            fieldsCount: trackerData.fieldsCount,
            fieldNames
        })
        .then(dispatch({ type: 'CREATE_TRACKER_SUCCESS' }))
        .catch(error => dispatch({ type: 'CREATE_TRACKER_ERROR', error}));
    };
};

export const deleteTracker = (trackerID) => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const state = getState();
        firestore.doc(`users/${state.firebase.auth.uid}/trackers/${trackerID}`)
        .delete()
        .then(dispatch({ type: 'DELETE_TRACKER_SUCCESS' }))
        .catch(error => dispatch({ type: 'DELETE_TRACKER_ERROR', error}));
    };
};

export const addFieldData = ({ fieldDate, fieldValues, trackerID}) => {
    return(dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const state = getState();
        const trackerIDPath = `users/${state.firebase.auth.uid}/trackers/${trackerID}`;
        firestore.doc(`${trackerIDPath}/trackedData/${fieldDate}`)
        .set({...fieldValues})
        .then(() => {
            const firebase = getFirebase();
            firestore.doc(trackerIDPath)
            .update({
                lastUpdatedAt: new Date(),
                trackedDaysCount: firebase.firestore.FieldValue.increment(1)
            })
            .catch(err => console.log('error', err));
        })
        .then(dispatch({ type: 'ADD_FIELD_DATA_SUCCESS' }))
        .catch(error => dispatch({ type: 'ADD_FIELD_DATA_ERROR', error}));
    };
};

export const deleteTrackedDay = ({trackerID, dayID}) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const state = getState();
        const trackerIDPath = `users/${state.firebase.auth.uid}/trackers/${trackerID}`;
        firestore.doc(`${trackerIDPath}/trackedData/${dayID}`)
        .delete()
        .then(() => {
            const firebase = getFirebase();
            firestore.doc(trackerIDPath)
            .update({
                lastUpdatedAt: new Date(),
                trackedDaysCount: firebase.firestore.FieldValue.increment(-1)
            });
        })
        .then(dispatch({ type: 'DELETE_TRACKED_DAY_DATA_SUCCESS' }))
        .catch(error => dispatch({ type: 'DELETE_TRACKED_DAY_DATA_ERROR', error}));
    };
};