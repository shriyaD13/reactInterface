import { AiOutlineCalendar } from "react-icons/ai";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";
import { useState , useEffect, useCallback } from "react";

function App() {

  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName");
  const [orderBy, setOrderBy] = useState("asc");

  const filteredAppointments = appointmentList.filter((item) => {
    return (
      item.petName.toLowerCase().includes(query.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
      item.aptNotes.toLowerCase().includes(query.toLowerCase())
    );
  }).sort((a,b) => {
    const order = (orderBy === "asc") ? 1 : -1;
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase() 
      ? -1 * order : 1 * order
    )
   })

  const fetchData = useCallback( ()  => {
    fetch('./data.json')
    .then((response) => response.json())
    .then((data) => setAppointmentList(data));
  },[])

  useEffect(() => fetchData(), [fetchData]);

  return (
    <div className="App container mx-auto mt-3 font-thin mx-auto">
      <h1 className="text-5xl"> <AiOutlineCalendar className="inline-block text-red-400 align-top"/> Your appointments</h1>
      <Search 
        query={query}
        onQueryChange={setQuery}
        orderBy = {orderBy}
        sortBy = {sortBy}
        onOrderChange = {(field) => setOrderBy(field)}
        onSortChange = { (sort) => setSortBy(sort)}
      />
      <AddAppointment 
        addData = {(data) => setAppointmentList([...appointmentList, data])}
        lastId = {appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
      />

      <ul className="divide-y divide-gray-200">
        {filteredAppointments.map((appointment) => (
          <AppointmentInfo 
            key={appointment.id}
            appointment= {appointment}
            onDeleteAppointment = {
              (appointmentId) => {
                setAppointmentList(
                  appointmentList.filter(appointment => appointment.id !== appointmentId)
                )
              }
            }
          />
        ) )}
      </ul>
    </div>
  );
}

export default App;
