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
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { DataGrid } from "@mui/x-data-grid";

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
  const [cardClicked, setCardClicker] = useState(false);
  const jobListingsDivRef = useRef(null);

  const [showFullContent, setShowFullContent] = useState(false);

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const [list, setList] = useState(jobListings);
  useEffect(() => {
    dispatch(fetchJobListings(1, filters, 10));
    return () => {
      if (jobListingsDivRef.current) {
        jobListingsDivRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [dispatch, filters]);

  useEffect(() => {
    setList((prevState) => {
      return prevState.concat(jobListings);
    });
  }, [jobListings]);

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
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

  // applying filters
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
  const handleCardClick1 = (job) => {
    setCardClicker(true);
    setSelectedCard(job);
  };
  const filteredJobListings = filterJobListings(list);

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <Grid
          container
          spacing={2}
          alignContent="center"
          justifyContent="center"
          style={{ maxWidth: "100%" }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="text"
              name="role"
              value={filters.role}
              onChange={handleInputChange}
              placeholder="Role..."
              fullWidth
              sx={{
                "& input": {
                  color: "#0000000",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                },
                "& fieldset": {
                  borderColor: "#263238",
                  borderRadius: "5px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="text"
              name="location"
              value={filters.location}
              onChange={handleInputChange}
              placeholder="Location..."
              fullWidth
              sx={{
                "& input": {
                  color: "#0000000",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                },
                "& fieldset": {
                  borderColor: "#263238",
                  borderRadius: "5px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="text"
              name="minSalary"
              value={filters.minSalary}
              onChange={handleInputChange}
              placeholder="Min Salary..."
              fullWidth
              sx={{
                "& input": {
                  color: "#0000000",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                },
                "& fieldset": {
                  borderColor: "#263238",
                  borderRadius: "5px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="text"
              name="company"
              value={filters.company}
              onChange={handleInputChange}
              placeholder="Company..."
              fullWidth
              sx={{
                "& input": {
                  color: "#0000000",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                },
                "& fieldset": {
                  borderColor: "#263238",
                  borderRadius: "5px",
                },
              }}
            />
          </Grid>
        </Grid>
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
          loader={<CircularProgress />}
          scrollableTarget="jobListingsDivRef"
        >
          <Grid container spacing={2}>
            {filteredJobListings.map((job, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card
                    style={{
                      width: "300px",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                      cursor: "pointer",
                      marginBottom: "20px",
                    }}
                  >
                    <CardContent>
                    <Typography
    variant="subtitle2"
    gutterBottom
    style={{
      fontFamily: 'Trebuchet MS, sans-serif',
      marginBottom: "8px",
      color: '#777', // Medium gray for company name
    }}
  >
    {job.companyName}
  </Typography>
  <Typography
    variant="subtitle2"
    gutterBottom
    style={{
      fontFamily: 'Trebuchet MS, sans-serif',
      fontWeight: "bold", 
      textTransform: "capitalize",
    }}
  >
    {job.jobRole}
  </Typography>
  <Typography
    variant="subtitle3"
    gutterBottom
    style={{
      fontFamily: "Arial, sans-serif",
      marginBottom: "16px",
      fontSize: "12px", 
      textTransform: "capitalize",
    }}
  >
    {job.location}
  </Typography>
                      <Typography style={{
      fontFamily: 'Trebuchet MS, sans-serif',
      marginBottom: "10px",
      fontWeight: "bold", 
      textTransform: "capitalize",
    }}>About Company</Typography>
                      <Typography style={{
      fontFamily: 'Trebuchet MS, sans-serif',
      marginBottom: "16px", 
      textTransform: "capitalize",
    }}>About us</Typography>
                      <div>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          style={{
                            fontFamily: 'Trebuchet MS, sans-serif',

                            textTransform: "capitalize",
                          }}
                        >
                          {showFullContent
                            ? job.jobDetailsFromCompany
                            : job.jobDetailsFromCompany.slice(0, 100)}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          style={{
                            fontFamily: 'Trebuchet MS, sans-serif',

                            textTransform: "capitalize",
                          }}
                          onClick={toggleContent}
                        >
                          {showFullContent ? "View Less" : "View More"}
                        </Typography>
                      </div>

                      <div
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTop: "1px solid #ddd",
                          paddingTop: "8px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
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
                            <>
                              {job.minExp == null || 0 ? (
                                <Typography
                                  variant="body2"
                                  gutterBottom
                                  style={{
                                    fontFamily: "Arial, sans-serif",
                                    marginBottom: "8px",
                                  }}
                                >
                                  0 years
                                </Typography>
                              ) : (
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
                              )}
                            </>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
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
                            <>
                              {job.minJdSalary == null || 0 ? (
                                <Typography
                                  variant="body2"
                                  gutterBottom
                                  style={{
                                    fontFamily: "Arial, sans-serif",
                                    marginBottom: "8px",
                                  }}
                                >
                                  {job.maxJdSalary} {job.salaryCurrencyCode}
                                </Typography>
                              ) : (
                                <Typography
                                  variant="body2"
                                  gutterBottom
                                  style={{
                                    fontFamily: "Arial, sans-serif",
                                    marginBottom: "8px",
                                  }}
                                >
                                  {job.minJdSalary} {job.salaryCurrencyCode} -{" "}
                                  {job.maxJdSalary} {job.salaryCurrencyCode}
                                </Typography>
                              )}
                            </>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start", // Align buttons to the left
                            marginTop: "8px", // Add some space between estimated salary and buttons
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            style={{
                              borderRadius: "20px",
                              padding: "10px 20px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              marginBottom: "8px",
                              textTransform: "none",
                              backgroundColor: "#54efc3",
                              color: "#000000",
                              width: "100%", // Set a fixed width for the button
                            }}
                          >
                            Easy Apply
                          </Button>
                          <Button
                            variant="outlined"
                            style={{
                              borderRadius: "20px",
                              padding: "10px 20px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              textTransform: "none",
                              backgroundColor: "#4943da",
                              borderColor: "#4943da",
                              color: "#FFFFFF",
                              width: "100%", // Set a fixed width for the button
                            }}
                          >
                            Ask for Referral
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
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
                backgroundColor: "#263238",
                color: "#FFFFFF",
              }}
              onClick={handleLoadMore}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
