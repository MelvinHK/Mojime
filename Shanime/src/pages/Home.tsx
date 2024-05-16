import Searchbar from '../components/Searchbar';
import { greetings } from '../styles/greetings.ts'

function Home() {
  return (<>
    <div id='title-screen'>
      <h1>捨nime</h1>
      <Searchbar />
      <p id="greeting">
        {greetings[Math.floor(Math.random() * greetings.length)]}
      </p>
    </div>
  </>);
}

export default Home;