import React,{useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles, Modal, Button } from '@material-ui/core';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false);

  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null)


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //if true then login
        setUser(authUser);
      }else{
        //user logged out
        setUser(null);
      }
    })

    return () => {
      //cleaning up
      unsubscribe();
    }
  },[user,username]);

    useEffect(() => {
      db.collection('posts').onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id : doc.id ,
          post:doc.data()
        })) );
      })
    }, [])


    const signUp = (event) => {
      event.preventDefault();

      auth.createUserWithEmailAndPassword(email,password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName : username
        })
      })
      .catch((e) => alert(e.message))
    }

console.log(user)
  return (
    <div className="App">

        <Modal
                open={open}
                onClose={() => setOpen(false)}
                
        >

                <div style={modalStyle} className={classes.paper}>
                  <form className="app_signUp">
                    <center>                  
                      <img 
                        className="app__headerImage"
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                        alt=""
                      />
                    </center>

                      <input 
                          className="i_text"
                          placeholder="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                      />

                      <input 
                          className="i_text"
                          placeholder="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />

                      <input 
                          className="i_text"
                          placeholder="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />

                        <Button color="default" type="submit" onClick={signUp}> Sign Up</Button>

                  </form>
                </div>
       
      </Modal>

      <div className="app__header">
            <img 
                      className="app__headerImage"
                      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                      alt=""
            />
      </div>


      {
        user ? 
            (      
                <Button onClick={ () => auth.signOut()} > Logout </Button>
            ) 

            : 

            (
              <div className="app__loginContainer">
                <Button onClick={() => setOpen(true)}> Sign In</Button>
                <Button onClick={() => setOpen(true)}> Sign Up</Button>
              </div>
            )

        }


      <h2>instagram</h2>

      {/* posts */}
      
      {posts.map(({id , post}) => 
        <Post key={id} username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
      )}
      
    </div>

    
    


    //posts
    //posts
  );
}

export default App;
