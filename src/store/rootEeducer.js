import { combineReducers } from 'redux';
import jobListingsReducer from '../reducers/jobLisitngsReducer';

const rootReducer = combineReducers({
  jobListings: jobListingsReducer
});

export default rootReducer;

