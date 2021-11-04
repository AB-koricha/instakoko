import React,{ useState,useEffect} from 'react';
import './App.css';
import Post from "./Post.js"
import { db,auth } from "./firebase"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

//its an helper function for styling of modal//all is from material ui
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
  const classes=useStyles()
  const [modalStyle] =useState(getModalStyle);
  const [posts,setPosts]=useState([])
  const [open,setOpen]=useState(false)
  const [openSignIn,setOpenSignIn]=useState(false)
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [user,setUser]=useState(null)
  //useEffect for Auth kuendelea mbele inorder to attach ata username
  useEffect(()=>{
    //what it do is any time auth changes happen it fires off like login,logout,sign up
    //unsubscribe do is even if you have to change username 100 times it keep cleaning
   const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user has logged in//like already yuko
        console.log(authUser)
        setUser(authUser)
      }else{
        //user had logged out
        setUser(null)
      }
    })
    return () => {
      //perform cleanup function before you fire off useEffect
      unsubscribe()
    }
  },[user,username])
//useEffect-is use to run the code base on specific condition
  useEffect(() => {
    db.collection("posts").orderBy("timestamp","desc").onSnapshot(snapshot=>(
      setPosts(snapshot.docs.map(doc=>({
        id:doc.id,
        post:doc.data()
      }
        )))
    ))
  }, [])
  const signUp=(event)=>{
    event.preventDefault()
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
     return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=> alert(error.message))
    setOpen(false)
  }
  const signIn=(event)=>{
    event.preventDefault()

    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))
    setOpenSignIn(false)
  }
  return (
    <div className="app">
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img
              className="app__headerImage"
              src="https://vectr.com/koricha/b2Rqg7cQ5.svg?width=640&height=640&select=b2Rqg7cQ5page0&quality=1"
              alt="kokologo"
           />
           </center>
           <Input
           type="text"
           placeholder="username"
           value={username}
           onChange={(e)=>setUsername(e.target.value)}
           />
           <Input
           type="text"
           placeholder="email"
           value={email}
           onChange={(e)=>setEmail(e.target.value)}
           />
           <Input
           type="password"
           placeholder="password"
           value={password}
           onChange={(e)=>setPassword(e.target.value)}
           />
           <Button type="submit" onClick={signUp}>sign Up</Button>
           </form>
        </div>
      </Modal>
      {/*this is modal for sign in*/}
      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img
              className="app__headerImage"
              src="https://vectr.com/koricha/b2Rqg7cQ5.svg?width=640&height=640&select=b2Rqg7cQ5page0&quality=1"
              alt="kokologo"
           />
           </center>
           <Input
           type="text"
           placeholder="email"
           value={email}
           onChange={(e)=>setEmail(e.target.value)}
           />
           <Input
           type="password"
           placeholder="password"
           value={password}
           onChange={(e)=>setPassword(e.target.value)}
           />
           <Button type="submit" onClick={signIn}>sign In</Button>
           </form>
        </div>
      </Modal>
     <div className="app__header">
       <img
       className="app__headerImage"
       src='https://vectr.com/koricha/b2Rqg7cQ5.svg?width=640&height=640&select=b2Rqg7cQ5page0&quality=1'
       alt='kokologo'
       />
       {user ? (
       <Button onClick={()=>auth.signOut()}>Logout</Button>
     ):(
       <div className="app__loginContainer">
         <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
         <Button onClick={()=>setOpen(true)}>Sign Up</Button>
       </div>
     )}
     </div>
     <div className="app__posts">
         {posts.map(({id,post})=>(
           <Post key={id} postId={id} user={user} username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
           />
        ))}
     </div>
     {/*instagram embed code*/}
     <InstagramEmbed
       url='https://www.instagram.com/p/B_uf9dmAGPw/'
       clientaccesstoken='123|456'
       maxWidth={320}
       hideCaption={false}
       containerTagName='div'
       protocol=''
       injectScript
       onLoading={() => {}}
       onSuccess={() => {}}
       onAfterRender={() => {}}
       onFailure={() => {}}
     />

     {/*hizi ni za imageupload*/}
     {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ):(
        <h3>Sorry you need to Login in order to upload the image</h3>
      )}
    </div>
  );
}

export default App;
