import {UPDATE_HAS_NEXT_PAGE,RESET_FILTERS, APPLY_FILTERS, FETCH_JOB_LISTINGS_REQUEST, FETCH_JOB_LISTINGS_SUCCESS, FETCH_JOB_LISTINGS_FAILURE } from '../actions/types';

const initialState = {
  jobListings: [],
  loading: false,
  error: null,
 originalJobListings: [],
};

const jobListingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_JOB_LISTINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_JOB_LISTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        jobListings: action.payload,
        originalJobListings: action.payload,
        error: null
      };
    case FETCH_JOB_LISTINGS_FAILURE:
      return {
        ...state,
        loading: false,
        jobListings: [],
        originalJobListings: [],
        error: action.payload
      };
    case APPLY_FILTERS:
      return {
        ...state,
        jobListings: filterJobListings(state.jobListings, action.payload)
      };
      case RESET_FILTERS:
        return {
          ...state,
          jobListings: state.originalJobListings 
        };  
        case UPDATE_HAS_NEXT_PAGE:
          return {
            ...state,
            hasNextPage: action.payload
          };  
    default:
      return state;
  }
};

const filterJobListings = (jobListings, filters) => {
  return jobListings.filter(job => {
 
    if (filters.role && !job.jobRole.toLowerCase().includes(filters.role.toLowerCase())) {
      return false;
    }
   
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
  
    if (filters.minSalary && job.minJdSalary && job.minJdSalary < filters.minSalary) {
      return false;
    }
   
    if (filters.maxSalary && job.maxJdSalary && job.maxJdSalary > filters.maxSalary) {
      return false;
    }

    if (filters.minExperience && job.minExp && job.minExp < filters.minExperience) {
      return false;
    }
   
    if (filters.maxExperience && job.maxExp && job.maxExp > filters.maxExperience) {
      return false;
    }
    return true;
  });
};

export default jobListingsReducer;