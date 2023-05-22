import { app } from "./config.js";
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);

const signup = document.getElementById('signup');
if (signup) {
    signup.addEventListener('click', (e) => {
        var firstname = document.getElementById('firstname').value;
        var lastname = document.getElementById('lastname').value;
        var email = document.getElementById('email').value;
        var photoURL = ""
        var password = document.getElementById('password').value;
        var countryCode = document.getElementById('country-code').value;
        var phoneNumber = document.getElementById('phone-number').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                setDoc(doc(db, 'Users', user.uid), {
                    name: firstname + " " + lastname,
                    email: email,
                    photoURL: photoURL,
                    phoneNumber: phoneNumber,  
                    countryCode: countryCode,
                })
                    .then(() => {
                        alert("User Created");
                        window.location = "/login.html"
                        
                    })
                    .catch((error) => {
                        const errorMessage = error.message;
                        alert(errorMessage);
                        
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
               
            });
    });
}

const login = document.getElementById('login');
if (login) {
    login.addEventListener('click', (e) => {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                const userRef = doc(db, 'Users', user.uid);
                updateDoc(userRef, {
                    last_login: new Date().toString()
                })
                    .then(() => {
                        alert("Login Successfull");
                        window.location = "/dashboard.html"
                    })
                    .catch((error) => {
                        const errorMessage = error.message;
                        alert(errorMessage);
                    });

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    });
}

// Attach click event listener to Google sign-in button
const googleSignInButton = document.getElementById('googlesignin');
if (googleSignInButton) { 
    googleSignInButton.addEventListener('click', (e) => {
        signInWithRedirect(auth, provider);
    });
}

// Call getRedirectResult before attaching click event listener
getRedirectResult(auth)
    .then((result) => {
        if (result && result.user) {
            // User is signed in, save user data to Firestore
            setDoc(doc(db, 'Users', result.user.uid), {
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                last_login: new Date().toString()
            })
                .then(() => {
                    alert("Login Successfull");
                    window.location = "/indexauthed.html"
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    alert(errorMessage);
                });
        }
    })
    .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
    });

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;
    const allowedUrls = [
        '/dashboard.html'
    ];
    const currentUrl = window.location.pathname;

    if (!allowedUrls.includes(currentUrl)) {
      // Redirect to authed page if not already there
        window.location = '/dashboard.html';
    } else {
      // Update profile information
      const profileImg = document.querySelector('.col-md-3 img');
      const profileName = document.querySelector('.col-md-9 h3');

      // Get user information from Firebase Auth
      // const db = getFirestore();
      const userRef = doc(db, 'Users', uid);
      getDoc(userRef)
        .then((doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            // Update profile image and name
            profileImg.src = userData.photoURL || '/img/avatar.png';
            profileName.textContent = userData.name || 'Anonymous';
          }
        })
        .catch((error) => {
          console.log('Error getting user document:', error);
        });

        // Get the number of cases reported by the user
        const reportsRef = collection(db, 'Reports');
        const filteredReports = query(reportsRef, where('uploadedby', '==', user.email)); // or getDocs(query(reportsRef))
        const querySnapshot = await getDocs(filteredReports);
        try {
                document.getElementById('numCases').textContent = querySnapshot.size;
            } catch (error) {
                console.log('Error getting reports:', error);
            }

    }
    } else {

    }
});

const logout = document.getElementById('logout');
if (logout) {
    logout.addEventListener('click', (e) => {
        signOut(auth).then(() => {
            // Sign-out successful.
            alert('Logged Out Successfully');
            window.location = "/login.html";
        }).catch((error) => {
            // An error happened.
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    });
}
