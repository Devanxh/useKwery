import { useQuery } from "../hooks/useQuery";


type User = {
  id: number;
  name: string;
};

async function fetchUser(): Promise<User> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

const TestingComponent = () => {
  const { data, isLoading, error, refetch } = useQuery<User>('user-1', fetchUser);
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (  
    <div>      
      <p><strong>ID:</strong> {data?.id}</p>
      <p><strong>Name:</strong> {data?.name}</p>
      <button onClick={refetch}>Refetch data</button>
    </div>
    );
}

export default function TestQueryPage() {
  const { data, isLoading, error } = useQuery<User>('user-1', fetchUser);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>User Info</h1>
      <p><strong>ID:</strong> {data?.id}</p>
      <p><strong>Name:</strong> {data?.name}</p>
      <TestingComponent/>
    </div>
  );
}
