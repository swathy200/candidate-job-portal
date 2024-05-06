import { 
    FETCH_JOB_LISTINGS_REQUEST, 
    FETCH_JOB_LISTINGS_SUCCESS, 
    FETCH_JOB_LISTINGS_FAILURE, 
    UPDATE_HAS_NEXT_PAGE
  } from './types';
  
  export const fetchJobListingsRequest = () => ({
    type: FETCH_JOB_LISTINGS_REQUEST
  });
  
  export const fetchJobListingsSuccess = (jobListings) => ({
    type: FETCH_JOB_LISTINGS_SUCCESS,
    payload: jobListings
  });
  
  export const updateHasNextPage = (hasNextPage) => ({
    type: UPDATE_HAS_NEXT_PAGE,
    payload: hasNextPage
  });
  
  export const fetchJobListingsFailure = (error) => ({
    type: FETCH_JOB_LISTINGS_FAILURE,
    payload: error
  });
  
  export const fetchJobListings = (page, filters, limit) => {
    return async (dispatch) => {
      dispatch(fetchJobListingsRequest());
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        const body = JSON.stringify({
          limit: 10,
          offset: (page - 1) * limit // Calculate offset based on page number
        });
  
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body
        };
  
        const response = await fetch(
          "https://api.weekday.technology/adhoc/getSampleJdJSON",
          requestOptions
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch job listings");
        }
  
        const data = await response.json();
        dispatch(fetchJobListingsSuccess(data.jdList));
        console.log(data)
        
   
        dispatch(updateHasNextPage(
          data.totalCount > data.jdList.length
        ));
      } catch (error) {
        dispatch(fetchJobListingsFailure(error.message));
      }
    };
  };
  