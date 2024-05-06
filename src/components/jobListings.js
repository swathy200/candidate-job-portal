import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobListings } from "../actions/jobListingsAction";
import {
  CircularProgress,
  TextField,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

const JobListings = () => {
  const dispatch = useDispatch();
  const { jobListings, loading, error, hasNextPage } = useSelector(
    (state) => state.jobListings
  );
  const [filters, setFilters] = useState({
    role: "",
    experience: "",
    minSalary: "",
    company: "",
    location: "",
    maxSalary: "",
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const jobListingsDivRef = useRef(null);

  const [list,setList]=useState(jobListings)
  useEffect(() => {
    dispatch(fetchJobListings(1, filters, 10));
    return () => {
      if (jobListingsDivRef.current) {
        jobListingsDivRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [dispatch, filters]);

 

  useEffect(()=>{
setList((prevState)=>{
  return prevState.concat(jobListings)
})
  },[jobListings])

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage)
    await dispatch(fetchJobListings(nextPage, filters, 10 * nextPage));
    jobListingsDivRef.current.scrollTo(0, scrollPosition);
  };
  
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = jobListingsDivRef.current;
    if (scrollTop + clientHeight >= scrollHeight) {
      setScrollPosition(scrollTop);
      handleLoadMore();
    }
  };
 
//   applying filters
  const filterJobListings = (listings) => {
    return listings.filter((job) => {
      const roleMatches =
        !filters.role ||
        job.jobRole.toLowerCase().startsWith(filters.role.toLowerCase());
      const locationMatches =
        !filters.location ||
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      const companyMatches =
        !filters.company ||
        job.companyName.toLowerCase().includes(filters.company.toLowerCase());
      const minSalaryMatches =
        !filters.minSalary || job.minJdSalary <= parseFloat(filters.minSalary);
      const experienceMatches =
        !filters.experience || job.minExp === parseFloat(filters.experience);
      return (
        roleMatches &&
        locationMatches &&
        companyMatches &&
        minSalaryMatches &&
        experienceMatches
      );
    });
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleCardClick = (job) => {
    setSelectedCard(job);
  };

 
  const filteredJobListings = filterJobListings(list);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gridGap: "20px",
        color: "#fff",
        padding: "10px",
        borderRadius: "10px",
        backgroundColor: "#cadcfc",
      }}
    >
      <div
        style={{
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "10px",
          gridColumn: "1 / 3",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <Grid
            container
            spacing={2}
            alignContent="center"
            justifyContent="space-around"
          >
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                type="text"
                name="role"
                value={filters.role}
                onChange={handleInputChange}
                placeholder="Role..."
                fullWidth
                sx={{
                  "& input": {
                    color: "#FFFFFF",
                    backgroundColor: "#00246b",
                    borderRadius: "5px",
                  },
                  "& fieldset": {
                    borderColor: "#3f51b5",
                    borderRadius: "5px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                type="text"
                name="location"
                value={filters.location}
                onChange={handleInputChange}
                placeholder="Location..."
                fullWidth
                sx={{
                  "& input": {
                    color: "#FFFFFF",
                    backgroundColor: "#00246b",
                    borderRadius: "5px",
                  },
                  "& fieldset": {
                    borderColor: "#3f51b5",
                    borderRadius: "5px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                type="text"
                name="minSalary"
                value={filters.minSalary}
                onChange={handleInputChange}
                placeholder="Min Salary..."
                fullWidth
                sx={{
                  "& input": {
                    color: "#FFFFFF",
                    backgroundColor: "#00246b",
                    borderRadius: "5px",
                  },
                  "& fieldset": {
                    borderColor: "#3f51b5",
                    borderRadius: "5px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                type="text"
                name="company"
                value={filters.company}
                onChange={handleInputChange}
                placeholder="Company..."
                fullWidth
                sx={{
                  "& input": {
                    color: "#FFFFFF",
                    backgroundColor: "#00246b",
                    borderRadius: "5px",
                  },
                  "& fieldset": {
                    borderColor: "#3f51b5",
                    borderRadius: "5px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                type="text"
                name="experience"
                value={filters.experience}
                onChange={handleInputChange}
                placeholder="Experience..."
                fullWidth
                sx={{
                  "& input": {
                    color: "#FFFFFF",
                    backgroundColor: "#00246b",
                    borderRadius: "5px",
                  },
                  "& fieldset": {
                    borderColor: "#3f51b5",
                    borderRadius: "5px",
                  },
                }}
              />
            </Grid>
          </Grid>
        </div>
      </div>
      
        <div
          ref={jobListingsDivRef}
          id="jobListingsDivRef"
          style={{
            padding: "20px",
            borderRadius: "10px",
            overflowY: "auto",
            borderRight: "1px solid #ccc",
            maxHeight: "calc(100vh - 150px)",
          }}
        >
             <InfiniteScroll
          dataLength={jobListings.length} 
          next={handleLoadMore}
          // hasMore={hasNextPage}
          loader={<CircularProgress />}
          scrollableTarget="jobListingsDivRef"
          
        >
           <Grid container spacing={2}>
          
          {filteredJobListings.map((job, index) => (
           <React.Fragment key={index}>
             <Grid item xs={12}>
               <Card
                 style={{
                   borderRadius: "10px",
                   boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                   cursor: "pointer",
                   marginBottom: "20px",
                 }}
               >
                 <CardContent>
                   <Typography
                     variant="h6"
                     gutterBottom
                     style={{
                       fontFamily: "Arial, sans-serif",
                       fontWeight: "bold",

                       marginBottom: "8px",
                     }}
                   >
                     {job.companyName}
                   </Typography>
                   <Typography
                     variant="subtitle1"
                     gutterBottom
                     style={{
                       fontFamily: "Arial, sans-serif",

                       marginBottom: "16px",
                       textTransform: "capitalize",
                     }}
                   >
                     {job.jobRole}
                   </Typography>
                   <div
                     style={{
                       display: "flex",
                       justifyContent: "space-between",
                       alignItems: "center",
                       borderTop: "1px solid #ddd",
                       paddingTop: "8px",
                     }}
                   >
                     <div>
                       <div
                         style={{ display: "flex", alignItems: "center" }}
                       >
                         <Typography
                           variant="body2"
                           gutterBottom
                           style={{
                             fontFamily: "Arial, sans-serif",

                             marginBottom: "8px",
                             marginRight: "4px",
                             fontWeight: "bold",
                           }}
                         >
                           Minimum Experience:
                         </Typography>
                         <Typography
                           variant="body2"
                           gutterBottom
                           style={{
                             fontFamily: "Arial, sans-serif",

                             marginBottom: "8px",
                           }}
                         >
                           {job.minExp} years
                         </Typography>
                       </div>

                       <div
                         style={{ display: "flex", alignItems: "center" }}
                       >
                         <Typography
                           variant="body2"
                           gutterBottom
                           style={{
                             fontFamily: "Arial, sans-serif",
                             color: "#aaa",
                             marginBottom: "8px",
                             marginRight: "4px",
                             fontWeight: "bold",
                           }}
                         >
                           Estimated Salary:
                         </Typography>
                         <Typography
                           variant="body2"
                           gutterBottom
                           style={{
                             fontFamily: "Arial, sans-serif",
                             marginBottom: "8px",
                           }}
                         >
                           {job.minJdSalary} {job.salaryCurrencyCode}-{" "}
                           {job.maxJdSalary} {job.salaryCurrencyCode}
                         </Typography>
                       </div>
                     </div>
                     <Button
                       variant="contained"
                       color="primary"
                       onClick={() => handleCardClick(job)}
                       style={{
                         borderRadius: "20px",
                         padding: "8px 20px",
                         textTransform: "none",
                         boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                         backgroundColor: "#00246b",
                       }}
                     >
                       Details
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             </Grid>
             {index !== filteredJobListings.length - 1 && (
               <Grid item xs={12}>
                 <Divider style={{ backgroundColor: "#666" }} />
               </Grid>
             )}
           </React.Fragment>
         ))}
       
        
       </Grid>
        </InfiniteScroll>
         
          {loading && <CircularProgress />}
          {!loading && hasNextPage && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            style={{
              borderRadius: "20px",
              padding: "10px 20px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              marginRight: "8px",
              textTransform: "none",
              backgroundColor: "#00246b",
              color: "#FFFFFF", 
            }}
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        </div>
        )}
        </div>
     
      <div
        style={{
          padding: "20px",
          borderRadius: "10px",
          overflowY: "auto",
        }}
      >
        {selectedCard && (
          <Card
          style={{
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            padding: "20px",
            backgroundColor: "#f5f5f5",
            fontFamily: "Arial, sans-serif", 
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              style={{
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#333", 
              }}
            >
              {selectedCard.companyName}
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{
                marginBottom: "16px",
                textTransform: "capitalize",
                color: "#555", 
              }}
            >
              {selectedCard.jobRole}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{
                marginBottom: "16px",
                color: "#777", 
              }}
            >
              {selectedCard.jobDetailsFromCompany}
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                gutterBottom
                style={{
                  marginBottom: "8px",
                  marginRight: "4px",
                  fontWeight: "bold",
                  color: "#444", 
                }}
              >
                Minimum Experience:
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                style={{
                  marginBottom: "8px",
                  color: "#666",
                }}
              >
                {selectedCard.minExp} years
              </Typography>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                gutterBottom
                style={{
                  marginBottom: "8px",
                  marginRight: "4px",
                  fontWeight: "bold",
                  color: "#444", 
                }}
              >
                Estimated Salary:
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                style={{
                  marginBottom: "8px",
                  color: "#666", 
                }}
              >
                {selectedCard.salaryCurrencyCode} {selectedCard.minJdSalary} -{" "}
                {selectedCard.salaryCurrencyCode} {selectedCard.maxJdSalary}
              </Typography>
            </div>
            <Grid container justifyContent="flex-end" spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    borderRadius: "20px",
                    padding: "10px 20px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    marginRight: "8px",
                    textTransform: "none",
                    backgroundColor: "#00246b",
                    color: "#FFFFFF", 
                  }}
                >
                  Easy Apply
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  style={{
                    borderRadius: "20px",
                    padding: "10px 20px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    textTransform: "none",
                    backgroundColor: "transparent", 
                    borderColor: "#00246b", 
                    color: "#00246b", 
                  }}
                >
                  Ask for Referral
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        )}
      </div>
    </div>
  );
};

export default JobListings;
