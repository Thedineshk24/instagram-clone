import React,{useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles, Modal, Button } from '@material-ui/core';
import ImageUpload from './ImageUpload';


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
  const [opensignin, setOpenSignIn] = useState(false);

  
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
        // var displayName = user.displayName; // for getting username
        return authUser.user.updateProfile({
          displayName : username
        })
      })
      .catch((e) => alert(e.message))

      setOpen(false);

    }

    const signIn = (event) => {
      event.preventDefault();

      auth.signInWithEmailAndPassword(email, password)
      .catch ( (e) => alert(e.message))

      setOpenSignIn(false); // to close pop window
    }

// console.log(user)
  return (
    <div className="App">

          {
          user?.displayName ? 
            (
                <ImageUpload username={user.displayName} />
            ) 
            :
            (
                <h3>you need to login first for uploading </h3>
            )
          }




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


      <Modal
                open={opensignin}
                onClose={() => setOpenSignIn(false)}
                
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

                        <Button color="default" type="submit" onClick={signIn}> Sign In</Button>

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
                <Button onClick={() => setOpenSignIn(true)}> Sign In</Button>
                <Button onClick={() => setOpen(true)}> Sign Up</Button>
              </div>
            )

        }


      <h2>instagram</h2>

      {/* posts */}

      
      
      {posts.map(({id , post}) => 
        <Post key={id} username={post.username.username} imageUrl={post.imageUrl} caption={post.caption} />
      )}
      

{/* {console.log(JSON.stringify(posts)) ||
 posts.map(({id , post}) => 
        <Post key={id} username={JSON.stringify( post.username)} imageUrl={JSON.stringify( post.imageUrl)}
         caption={JSON.stringify( post.caption)} />
      )} */}

{/* {
    Object.keys(posts).map((id,post) =>
     (<Post key={id} username={post[username]}  imageUrl={post[imageUrl]} caption={post[caption]} />))
}
       */}

      
    </div>

    
    


    //posts
    //posts
  );
}

export default App;
