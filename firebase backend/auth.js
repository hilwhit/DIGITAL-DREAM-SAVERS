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
        '/dashboard.html',
        '/investments.html',
        '/profile.html',
        '/deposit.html',
        '/withdraw.html',
        '/domesticequities.html',
        'fixedincome.html',
        'moneymarkets.html',
        'realestate.html',

    ];
    const currentUrl = window.location.pathname;

    if (!allowedUrls.includes(currentUrl)) {
      // Redirect to authed page if not already there
        window.location = '/dashboard.html';
    } else {
      // Update profile information
        const userNameElement = document.getElementById('userName');
        const profileImageElement = document.getElementById('profileImage');
        const profileNameElement = document.getElementById('profileName');
        const fullNameElement = document.getElementById('fullName');
        const countryCodeElement = document.getElementById('countryCode');
        const phoneNumberElement = document.getElementById('phoneNumber');
        const emailElement = document.getElementById('email');
        const fullNameInputElement = document.getElementById('fullNameInput');
        const phoneInputElement = document.getElementById('phoneInput');
        const emailInputElement = document.getElementById('emailInput');

      // Get user information from Firebase Auth
      // const db = getFirestore();
      const userRef = doc(db, 'Users', uid);
      getDoc(userRef)
        .then((doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            // Update profile image and name
                userNameElement.textContent = userData.name;
                profileImageElement.src = userData.photoURL || 'profile.png';
                profileNameElement.textContent = userData.name || 'Anonymous';
                fullNameElement.textContent = userData.name || 'Anonymous';
                fullNameInputElement.value = userData.name || 'Anonymous';
                countryCodeElement.textContent = userData.countryCode || 'No Country Code';
                phoneNumberElement.textContent = userData.phoneNumber || 'No Phone Number';
                phoneInputElement.value = (userData.countryCode || 'No Country Code') + ' ' + (userData.phoneNumber || 'No Phone Number');
                emailElement.textContent = userData.email || 'No Email';
                emailInputElement.value = userData.email || 'No Email';
          }
        })
        .catch((error) => {
          console.log('Error getting user document:', error);
        });
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
