import axios from "axios";
import { useAxios } from "./hooks/useAxios";

function App(): JSX.Element {

  const { data, error, loading } = useAxios<{ id: number; name: string }[]>({
    instance: axios,
    url: 'https://jsonplaceholder.typicode.com/users',
    method: 'GET',
    enabled: true
  });

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error:</div>;

  if (!data) return <div>No data available</div>;

  return  <ul>
  {data.map(user => (
    <li key={user.id}>{user.name}</li>
  ))}
</ul>
}

export default App;
