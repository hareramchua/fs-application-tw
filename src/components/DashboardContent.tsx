import CircularProgress from "./CircularProgress";
import Button from "./Button";
import Container from "./Container";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import ImageTab from "./ImageTab";
import dummy from "../data/test01.json";
import { DataContext } from "@/data/data-context";
import Building from "../assets/building.png";
import Room from "../assets/room.png";

export default function DashboardContent() {
  const [content, setContent] = useState({
    selectedTab: "buildings",
    buildingId: undefined,
    data: undefined,
  });

  const navigate = useNavigate();
  const { buildings, rooms } = useContext(DataContext);
  const params = useParams();

  useEffect(() => {
    setContent((prev) => ({
      ...prev,
      data: buildings,
    }));
  }, [buildings]);

  useEffect(() => {
    if (rooms && params.id) {
      const filteredRooms = rooms.filter(
        (room) => room.buildingId === params.id
      );
      setContent((prev) => ({
        ...prev,
        selectedTab: "rooms",
        data: filteredRooms,
      }));
    }
  }, [rooms, params.id]);

  function handleTabSelect(selected) {
    if (selected !== content.selectedTab) {
      const newData = selected === "buildings" ? buildings : rooms;
      setContent((prev) => ({
        ...prev,
        selectedTab: selected,
        data: newData,
      }));
    }
  }

  function handleContainerSelect(id) {
    if (content.selectedTab === "buildings") {
      const filteredRooms = rooms.filter((room) => room.buildingId === id);
      setContent({
        selectedTab: "rooms",
        buildingId: id,
        data: filteredRooms,
      });
    } else if (content.selectedTab === "rooms") {
      navigate(`/room/${id}`);
    }
  }

  return (
    <div className="flex flex-col w-full m-auto xs:p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="flex flex-col gap-4 justify-center items-center mt-4 mx-auto w-full sm:w-[22rem] md:w-full lg:w-[95rem]">
        {content.data?.length > 0 ? (
          content.data.map((item, index) => {
            let contentLength = content.data?.length;
            let length =
              contentLength <= 3
                ? 1
                : contentLength <= 7
                ? 2
                : contentLength <= 10
                ? 3
                : 4;
            if (index < length)
              return (
                <div
                  key={index}
                  className={`flex ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  } flex-wrap w-full justify-center gap-8`}
                >
                  {Array.from({ length: index % 2 === 0 ? 3 : 4 }).map(
                    (_, columnIndex) => {
                      const dataIndex = index * 3 + columnIndex;
                      const dataItem = content.data[dataIndex];
                      if (!dataItem) return null;
                      const id = dataItem.id;
                      const img = dataItem.image;
                      const title =
                        content.selectedTab === "buildings"
                          ? dataItem.buildingName
                          : dataItem.roomNumber;
                      const code =
                        content.selectedTab === "buildings"
                          ? dataItem.buildingCode ?? ""
                          : "";

                      const childrens = rooms.filter(
                        (curr) => curr.buildingId === id
                      );

                      return (
                        <Container
                          key={id}
                          img={img}
                          title={title}
                          noOfChildren={childrens.length}
                          code={code}
                          onClick={() => handleContainerSelect(id)}
                        />
                      );
                    }
                  )}
                </div>
              );
          })
        ) : content.data?.length === 0 ? (
          <p className="text-neutral-500">The building is empty</p>
        ) : (
          dummy &&
          dummy.map((item, index) => {
            let contentLength = content.data?.length;
            let length =
              contentLength <= 3
                ? 1
                : contentLength <= 7
                ? 2
                : contentLength <= 10
                ? 3
                : 4;
            if (index < length)
              return (
                <div
                  key={index}
                  className={`flex ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  } flex-wrap w-full justify-center gap-8`}
                >
                  {Array.from({ length: index % 2 === 0 ? 3 : 4 }).map(
                    (_, columnIndex) => {
                      const dataIndex = index * 4 + columnIndex;
                      const dataItem = dummy[dataIndex];
                      if (!dataItem) return null;
                      const id = dataItem.id;
                      return <Container key={id} />;
                    }
                  )}
                </div>
              );
          })
        )}
      </div>

      <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center justify-center sm:bottom-8 md:bottom-4">
        <menu className="flex justify-center items-center bg-stone-100 rounded-full py-2 px-4 w-full xs:w-[200px] sm:w-[250px] md:w-[300px]">
          <NavLink
            to="/home"
            className={`flex justify-center flex-col items-center w-[50%] ${
              content.selectedTab === "buildings" ? "font-bold" : ""
            }`}
            onClick={() => handleTabSelect("buildings")}
          >
            <ImageTab
              img={Building}
              label="building"
              isSelected={content.selectedTab === "buildings"}
              isDisabled={false}
            />
            <h3 className="text-neutral-600 text-sm">Buildings</h3>
          </NavLink>
          <Button
            liCss="flex justify-center flex-col items-center w-[50%]"
            onClick={() => handleTabSelect("rooms")}
            cssAdOns={content.selectedTab === "rooms" ? "font-bold" : undefined}
            disabled={content.selectedTab === "rooms" ? false : true}
          >
            <ImageTab
              img={Room}
              label="room"
              isSelected={content.selectedTab === "rooms"}
              isDisabled={content.selectedTab === "rooms" ? false : true}
            />
            <h3 className="text-neutral-600 text-sm">Rooms</h3>
          </Button>
        </menu>
        <p className="text-neutral-500">
          /{" "}
          <span className="text-neutral-600">
            {content.selectedTab === "rooms" &&
              buildings.find((building) => {
                const id = content.buildingId || params.id;
                return building.id === id;
              })?.buildingName}
          </span>
        </p>
      </div>
    </div>
  );
}
