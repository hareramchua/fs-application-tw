import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const DataContext = createContext({
  users: undefined,
  buildings: undefined,
  rooms: undefined,
  spaces: undefined,
  spaceImages: undefined,
  ratings: undefined,
  comments: undefined,
  redTags: undefined,
  useEntry: () => {},
});

const endpoint = "https://fs-backend-copy-production.up.railway.app";

export default function DataContextProvider({ children }) {
  const [data, setData] = useState({
    users: undefined,
    buildings: undefined,
    rooms: undefined,
    spaces: undefined,
    spaceImages: undefined,
    ratings: undefined,
    comments: undefined,
  });

  async function fetchAllData() {
    try {
      const newData = {
        users: [],
        buildings: [],
        rooms: [],
        spaces: [],
        ratings: [],
        comments: [],
      };
      newData.users = (await axios.get(`${endpoint}/api/user`)).data.map(
        (user) => ({
          ...user,
          Name: `${user.firstName} ${user.lastName}`, // Calculate fullname
        })
      );
      newData.buildings = (await axios.get(`${endpoint}/api/buildings`)).data;
      newData.rooms = (await axios.get(`${endpoint}/api/rooms`)).data;
      newData.spaces = (await axios.get(`${endpoint}/api/space`)).data;
      newData.ratings = (await axios.get(`${endpoint}/api/ratings`)).data;
      newData.comments = (await axios.get(`${endpoint}/api/comment`)).data;
      console.log(newData);
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  }

  async function getSpaceImagesBySpaceId(id) {
    try {
      const spaceImages = (
        await axios.get(`${endpoint}/api/spaceImage/get/${id}`)
      ).data;
      console.log("space images {} ", spaceImages);
      setData((prev) => {
        return {
          ...prev,
          spaceImages,
        };
      });
    } catch (error) {
      console.log(error);
      setData((prev) => {
        return {
          ...prev,
          spaceImages: [],
        };
      });
    }
  }

  async function addSpaceImage(image, id) {
    const formData = new FormData();
    formData.append("file", image);
    await axios.post(`${endpoint}/api/spaceImage/upload/${id}`, formData);
  }

  async function deleteSpaceImage(id) {
    await axios.delete(`${endpoint}/api/spaceImage/delete/${id}`);
  }

  async function addNewUser(userData) {
    try {
      // Make the POST request to add a new user
      const response = await axios.post(`${endpoint}/api/user`, userData);
      
      // Extract the ID of the newly created user from the response
      const userId = response.data.id;

      // Log the success message along with the user ID
      console.log("User added successfully. User ID:", userId);

      // Optionally, you can perform further actions with the user ID here
      
  } catch (error) {
      console.error("Error adding new user:", error);
  }
  }

  async function updateUser(userId, updatedUserData) {
    return axios
      .put(`${endpoint}/api/user/${userId}`, updatedUserData)
      .then(() => console.log(`User with ID ${userId} updated successfully`))
      .catch((error) => console.error("Error updating user:", error));
  }

  async function deleteUser(userId) {
    await axios.delete(`${endpoint}/api/user/${userId}`);
  }

  async function addBuilding(buildingData) {
    try {
      // Send a POST request to the API endpoint with the new building data
      const response = await axios.post(`${endpoint}/api/buildings`, buildingData);

      // Return the newly created building object from the response
      return response.data;
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Error adding building:", error);
      throw error; // Optional: rethrow the error to be handled elsewhere
    }
  }

  async function updateBuilding(buildingId, updatedBuildingData) {
    return axios
      .put(`${endpoint}/api/buildings/${buildingId}`, updatedBuildingData)
      .then(() => console.log(`Building with ID ${buildingId} updated successfully`))
      .catch((error) => console.error("Error updating building:", error));
  }

  // async function updateBuilding(buildingId, updatedBuildingData) {
  //   try {
  //     console.log(buildingId);
  //     console.log(updatedBuildingData);
  //     // Send a PUT request to the API endpoint with the updated data
  //     const response = await axios.put(`${endpoint}/api/buildings/${buildingId}`,updatedBuildingData);

  //     // Return the updated building object from the response
  //     console.log(updatedBuildingData);
  //     return response.data;
  //   } catch (error) {
  //     // Handle any errors that occur during the request
  //     console.error("Error updating building:", error);
  //     throw error; // Optional: rethrow the error to be handled elsewhere
  //   }
  // }

  async function deleteBuilding(buildingName) {
    await axios.delete(`${endpoint}/api/buildings/${buildingName}`);
  }

  //create room add and edit here
  async function addRoom(roomData) {
    try {
      // Send a POST request to the API endpoint with the new room data
      const response = await axios.post(`${endpoint}/api/rooms`, roomData);

      // Return the newly created room object from the response
      return response.data;
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Error adding room:", error);
      throw error; // Optional: rethrow the error to be handled elsewhere
    }
  }

  async function updateRoom(roomId, updatedRoomData) {
    return axios
      .put(`${endpoint}/api/rooms/${roomId}`, updatedRoomData)
      .then(() => console.log(`Room with ID ${roomId} updated successfully`))
      .catch((error) => console.error("Error updating room:", error));
  }

  async function deleteRoom(roomNumber, buildingId) {
    await axios.delete(
      `${endpoint}/api/rooms/${buildingId}?roomNumber=${roomNumber}`
    );
  }

  async function addSpace(spaceData) {
    try {
      // Send a POST request to the API endpoint with the new room data
      const response = await axios.post(`${endpoint}/api/space`, spaceData);

      // Return the newly created room object from the response
      return response.data;
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Error adding space:", error);
      throw error; // Optional: rethrow the error to be handled elsewhere
    }
  }

  async function updateSpace(spaceId, updatedSpaceData) {
    return axios
      .put(`${endpoint}/api/space/${spaceId}`, updatedSpaceData)
      .then(() => console.log(`Space with ID ${spaceId} updated successfully`))
      .catch((error) => console.error("Error updating space:", error));
  }

  async function deleteSpace(spaceId) {
    await axios.delete(`${endpoint}/api/space/${spaceId}`);
  }

  /*
  ------------------------
  function handleUseEntry
  ------------------------
    param: action = {
        type: buildings/users/rooms/..
        method: GET/POST/..
        data: {} // if necessary
    }  
  */
  async function handleUseEntry(action) {
    //..
    if (action.type === "spaceimages") {
      if (action.method === "get") {
        await getSpaceImagesBySpaceId(action.data.id);
      }
      if (action.method === "post") {
        const image = action.data.file;
        await addSpaceImage(image, action.data.id);
        await getSpaceImagesBySpaceId(action.data.id);
      }
      if (action.method === "delete") {
        await deleteSpaceImage(action.data.imageId);
        await getSpaceImagesBySpaceId(action.data.spaceId);
        console.log("deleted");
      }
    }
    if (action.type === "ratings") {
      if (action.method === "get") {
        const ratings = (await axios.get(`${endpoint}/api/ratings`)).data;
        console.log(ratings);

        setData((prev) => {
          return {
            ...prev,
            ratings,
          };
        });
      }
      if (action.method === "post") {
        let scores = action.data.scores;
        console.log("scores", scores);
        const newRate = {
          id: "",
          sort: scores.sort,
          setInOrder: scores.setInOrder,
          shine: scores.shine,
          standarize: 0,
          sustain: 0,
          security: 0,
          isActive: true,
          spaceId: scores.spaceId,
        };
        const rating = (await axios.post(`${endpoint}/api/ratings`, newRate))
          .data;
        console.log(rating);
        const newComment = {
          id: "",
          sort: scores.comment.sort,
          setInOrder: scores.comment.setInOrder,
          shine: scores.comment.shine,
          standarize: "",
          sustain: "",
          security: "",
          isActive: true,
          ratingId: rating,
        };
        await axios.post(`${endpoint}/api/comment`, newComment);
        const comments = (await axios.get(`${endpoint}/api/comment`)).data;
        const ratings = (await axios.get(`${endpoint}/api/ratings`)).data;
        console.log(ratings);
        console.log(comments);

        setData((prev) => {
          return {
            ...prev,
            comments,
            ratings,
          };
        });
      }
    }
    if (action.type === "users") {
      if (action.method === "post") {
        console.log(action.data);
        await addNewUser(action.data);
      }
      if (action.method === "put") {
        const updatedUserData = action.data.data; // Assuming action.data contains the updated user data
        const userId = action.data.id;

        // Extract username and password from updatedUserData

        // Perform the edit logic here, such as making a PUT request to your backend API
        try {
          // Assuming your API endpoint for updating a user is `${endpoint}/api/user/${userId}`
          await updateUser(userId, updatedUserData);

          // After successful update, update the user data in state
          setData((prevData) => {
            return {
              ...prevData,
              users: prevData.users.map((user) => {
                if (user.id === userId) {
                  // Merge existing user data with the updated data, excluding username and password
                  return {
                    ...user,
                    ...updatedUserData,
                  };
                }
                return user;
              }),
            };
          });
        } catch (error) {
          console.error("Error updating user:", error);
        }
      }
      if (action.method === "delete") {
        const userId = action.data.id;
        // Perform the deletion logic here, such as making a DELETE request to your backend API
        try {
          // Assuming your API endpoint for deleting a user is `${endpoint}/api/user/${userId}`
          await deleteUser(userId);
          // After successful deletion, update the users data in state
          setData((prevData) => ({
            ...prevData,
            users: prevData.users.filter((user) => user.id !== userId),
          }));
          console.log(`User with ID ${userId} deleted successfully`);
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    }
    if (action.type === "buildings") {
      // Handle the action for buildings here for post
      if (action.method === "post") {
        const newBuildingData = action.data; // Assuming action.data contains the new Building data
        console.log(newBuildingData);
        
        try {
          // Assuming your API endpoint for adding a Building is `${endpoint}/api/buildings`
          await addBuilding(newBuildingData);
          
          console.log("Building added successfully");
        } catch (error) {
          console.error("Error adding building:", error);
        }
      }
      if (action.method === "put") {
        const updatedBuildingData = action.data; // Assuming action.data contains the updated Building data
        const buildingId = updatedBuildingData.id;
        // Perform the edit logic here, such as making a PUT request to your backend API
        try {
          // Assuming your API endpoint for updating a Building is `${endpoint}/api/user/${BuildingId}`
          await updateBuilding(buildingId, updatedBuildingData);
          // After successful update, update the user data in state
          console.log(buildingId, updatedBuildingData);
          console.log(`Building with ID ${buildingId} updated successfully`);
        } catch (error) {
          console.error("Error updating building:", error);
        }
      }
      if (action.method === "delete") {
        const buildingName = action.data.buildingName;
        console.log(buildingName);
        // Perform the deletion logic here, such as making a DELETE request to your backend API
        try {
          // Assuming your API endpoint for deleting a building is `${endpoint}/api/buildings/${buildingName}`
          await deleteBuilding(buildingName);
          // After successful deletion, update the building data in state
          setData((prevData) => ({
            ...prevData,
            buildings: prevData.buildings.filter(
              (building) => building.buildingName !== buildingName
            ),
          }));
          console.log(
            `Building with Name ${buildingName} deleted successfully`
          );
        } catch (error) {
          console.error("Error deleting Building:", error);
        }
      }
    }
    if (action.type === "rooms") {
      if (action.method === "post") {
        const roomData = action.data;
        const roomId = action.data.id;
        console.log(roomData);
        // Perform the creation logic here, such as making a POST request to your backend API
        try {
          // Assuming your API endpoint for creating a room is `${endpoint}/api/rooms`
          await addRoom(roomData);
          // After successful creation, update the room data in state there is no prevdata tho, since its newly added how to render it
          console.log("Newly created room ID:", roomId);
          //update the room data in state there is no prevdata tho, since its newly added how to render it
          setData((prevData) => {
            return {
              ...prevData,
              rooms: [...prevData.rooms, roomData],
            };
          });
          console.log("Room created successfully");
        } catch (error) {
          console.error("Error creating room:", error);
        }
      }
      if (action.method === "put") {
        const updatedRoomData = action.data; // Assuming action.data contains the updated Building data
        const roomId = updatedRoomData.id;
        // Perform the edit logic here, such as making a PUT request to your backend API
        try {
          // Assuming your API endpoint for updating a Building is `${endpoint}/api/user/${BuildingId}`
          await updateRoom(roomId, updatedRoomData);
          setData((prevData) => {
            return {
              ...prevData,
              rooms: prevData.rooms.map((room) => {
                if (room.id === roomId) {
                  // Merge existing user data with the updated data, excluding username and password
                  return {
                    ...room,
                    ...updatedRoomData,
                  };
                }
                return room;
              }),
            };
          });
          console.log(roomId, updatedRoomData);
          console.log(`Room with ID ${roomId} updated successfully`);
        } catch (error) {
          console.error("Error updating room:", error);
        }
      }
      if (action.method === "delete") {
        const { roomNumber, buildingId } = action.data;
        console.log(roomNumber, buildingId);
        // Perform the deletion logic here, such as making a DELETE request to your backend API
        try {
          // Assuming your API endpoint for deleting a room is `${endpoint}/api/rooms/${roomNumber}`
          await deleteRoom(roomNumber, buildingId);
          // After successful deletion, update the room data in state
          setData((prevData) => ({
            ...prevData,
            rooms: prevData.rooms.filter(
              (room) => room.roomNumber !== roomNumber
            ),
          }));
          console.log(
            `Room with number ${roomNumber} in building ${buildingId} deleted successfully`
          );
        } catch (error) {
          console.error("Error deleting room:", error);
        }
      }
    }
    if (action.type === "spaces") {
      if (action.method === "post"){
        const spaceData = action.data;
        const spaceId = action.data.id;
        console.log(spaceData);
        // Perform the creation logic here, such as making a POST request to your backend API
        try {
          // Assuming your API endpoint for creating a room is `${endpoint}/api/rooms`
          await addSpace(spaceData);
          // After successful creation, update the room data in state there is no prevdata tho, since its newly added how to render it
          console.log("Newly created space ID:", spaceId);
          //update the room data in state there is no prevdata tho, since its newly added how to render it
          setData((prevData) => {
            return {
              ...prevData,
              spaces: [...prevData.spaces, spaceData],
            };
          });
          console.log("Space created successfully");
        } catch (error) {
          console.error("Error creating space:", error);
        } 
      }
      if (action.method === "put") {
        const updatedSpaceData = action.data.data; // Assuming action.data contains the updated Building data
        const spaceId = action.data.id;
        // Perform the edit logic here, such as making a PUT request to your backend API
        try {
          // Assuming your API endpoint for updating a Building is `${endpoint}/api/user/${BuildingId}`
          await updateSpace(spaceId, updatedSpaceData);
          setData((prevData) => {
            return {
              ...prevData,
              spaces: prevData.spaces.map((space) => {
                if (space.id === spaceId) {
                  // Merge existing user data with the updated data, excluding username and password
                  return {
                    ...space,
                    ...updatedSpaceData,
                  };
                }
                return space;
              }),
            };
          });
          console.log(spaceId, updatedSpaceData);
          console.log(`Space with ID ${spaceId} updated successfully`);
        } catch (error) {
          console.error("Error updating space:", error);
        }
      }
      if (action.method === "delete") {
        const spaceId = action.data.id;
        console.log(spaceId);
        // Perform the deletion logic here, such as making a DELETE request to your backend API
        try {
          // Assuming your API endpoint for deleting a room is `${endpoint}/api/space/${spaceId}`
          await deleteSpace(spaceId);
          // After successful deletion, update the space data in state
          setData((prevData) => ({
            ...prevData,
            spaces: prevData.spaces.filter((space) => space.id !== spaceId),
          }));
          console.log(`Space with ID ${spaceId} deleted successfully`);
        } catch (error) {
          console.error("Error deleting space:", error);
        }
      }
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  const dataCtx = {
    users: data.users,
    buildings: data.buildings,
    rooms: data.rooms,
    spaces: data.spaces,
    spaceImages: data.spaceImages,
    ratings: data.ratings,
    comments: data.comments,
    useEntry: handleUseEntry,
  };
  return (
    <DataContext.Provider value={dataCtx}>{children}</DataContext.Provider>
  );
}
