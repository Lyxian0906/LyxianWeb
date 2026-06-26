import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    setDoc,
    doc,
    deleteDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const firebaseConfig = {

    apiKey: "AIzaSyAhrmgxBpsIkqMzy_lygy0_7z-UaZxHT4Q",

    authDomain: "lyxian-d017d.firebaseapp.com",

    projectId: "lyxian-d017d",

    storageBucket: "lyxian-d017d.firebasestorage.app",

    messagingSenderId: "504544640908",

    appId: "1:504544640908:web:6bc1e9ee74c657f3ea60a9",

    measurementId: "G-VVHBK1TFS8"

};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let selectedMemory = null;

import {
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

setPersistence(auth, browserLocalPersistence)
    .catch((error) => console.log(error));

if (window.location.pathname.includes("/LyxianWeb/Register-and-login/login.html")) {

    onAuthStateChanged(auth, async (user) => {

        if (user) {

            await loadMemories();

            window.location.href = "/LyxianWeb/index.html";

        }

    });

}

if (window.location.pathname.includes("/LyxianWeb/index.html")) {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            window.location.href = "/LyxianWeb/Register-and-login/login.html";

        } else {

            await loadMemories();

        }

    });

}
//
// Register
//
const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {
    registerBtn.addEventListener("click", async () => {

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const username = document.getElementById("username").value;

        try {
            const userCredential =
                await createUserWithEmailAndPassword(auth, email, password);

            const user = userCredential.user;

            await sendEmailVerification(user);

            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                createdAt: Date.now()
            });

            document.getElementById("message").textContent =
                "Account created! Check your email to verify your account.";

            document.getElementById("message").textContent = "Account created!";
        }
        catch (error) {
            document.getElementById("message").textContent = error.message;
        }
    });
}

//
// Login
//
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
    loginBtn.addEventListener("click", async () => {

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            const userCredential =
                await signInWithEmailAndPassword(auth, email, password);

            const user = userCredential.user;

            // 🔥 CHECK EMAIL VERIFICATION HERE
            if (!user.emailVerified) {
                await signOut(auth);
                document.getElementById("message").textContent =
                    "Verify your email first.";
                return;
            }

            document.getElementById("message").textContent =
                "Login successful! Redirecting in 6 seconds...";

            setTimeout(() => {
                window.location.href = "/LyxianWeb/index.html";
            }, 6000);

        } catch (error) {
            document.getElementById("message").textContent =
                "Error trying to login, check email or password";
        }
    });
}

//
// Logout
//
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "Register-and-login/login.html";
    });
}

//
// Welcome name
//
onAuthStateChanged(auth, async (user) => {
    const welcome = document.getElementById("welcome");

    if (user && welcome) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            welcome.textContent = "Welcome to (), " + data.username;
        }
    }

    if (!user && window.location.pathname.includes("/LyxianWeb/index.html")) {
        window.location.href = "/LyxianWeb/Register-and-login/login.html";;
    }
});


//Second "Welcome"
onAuthStateChanged(auth, async (user) => {
    const welcome2 = document.getElementById("welcome2");

    if (user && welcome2) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            welcome2.textContent = "This is " + data.username + "'s tree";
        }
    }

    if (!user && window.location.pathname.includes("/LyxianWeb/MyTree/mytree.html")) {
        window.location.href = "/LyxianWeb/Register-and-login/login.html";;
    }
});

//Google Login
import {
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

const googleBtn = document.getElementById("googleBtn");

if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            window.location.href = "/LyxianWeb/index.html";
        } catch (error) {
            console.log(error.code, error.message);
        }
    });
}

//Go to login from register
const btnToLogin2 = document.getElementById("btnToLogin2");
if (btnToLogin2) {
    btnToLogin2.addEventListener("click", () => {
        window.location.href = "/LyxianWeb/Register-and-login/login.html";
    });
}

//Go to register from login
const btnPage2 = document.getElementById("btnPage2");
if (btnPage2) {
    btnPage2.addEventListener("click", () => {
        window.location.href = "/LyxianWeb/Register-and-login/register.html";
    });
}


const musicBtn2 = document.getElementById("musicBtn2");
const bgMusic2 = document.getElementById("bgMusic2");

if (musicBtn2 && bgMusic2) {
    musicBtn2.addEventListener("click", () => {
        if (bgMusic2.paused) {
            bgMusic2.play();
        } else {
            bgMusic2.pause();
        }
    });
}

//My tree
const MyTree = document.getElementById("MyTree");
if (MyTree) {
    const MyTree = document.getElementById("MyTree");
    console.log(MyTree);
    MyTree.addEventListener("click", () => {
        window.location.href = "/LyxianWeb/MyTree/mytree.html";
    });
}

//Go back 

const goback = document.getElementById("goback");
if (goback) {
    const goback = document.getElementById("goback");
    console.log(goback);
    goback.addEventListener("click", () => {
        window.location.href = "/LyxianWeb/index.html";
    });
}


// MENU

const addBtn = document.getElementById("addMemory");
const menu = document.getElementById("memoryMenu");
let canPlace = false;
let placingBall = null;

document.addEventListener("click", async (e) => {

    if (!placingBall || !canPlace) return;

    placingBall.style.left = e.clientX + "px";
    placingBall.style.top = e.clientY + "px";

    try {

        await addDoc(collection(db, "users", user.uid, "memories"), {
            uid: user.uid,
            emotion: emotion,
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            notes: document.getElementById("notes").value,
            createdAt: new Date()
        });

        console.log("Memory saved!");

    } catch (error) {

        console.log(error);

    }

    placingBall = null;
    canPlace = false;

});
// Open menu
if (addBtn) {
    addBtn.addEventListener("click", () => {
        menu.classList.remove("hidden");
    });
}


function openPopup(memory) {

    const popup = document.getElementById("memoryPopup");

    document.getElementById("popupTitle").textContent = memory.title;
    document.getElementById("popupEmotion").textContent = memory.emotion;
    document.getElementById("popupDescription").textContent = memory.description;
    document.getElementById("popupNotes").textContent = memory.notes;

    popup.classList.remove("hidden");
}

//Create a ball
function createBall(memory) {

    const ball = document.createElement("div");
    ball.classList.add("ballMemory");

    ball.style.background = memory.emotion;
    ball.style.left = memory.x + "px";
    ball.style.top = memory.y + "px";

    // store id in the DOM element
    ball.dataset.id = memory.id;

    document.body.appendChild(ball);
    let selectedMemory = null;

    ball.addEventListener("click", () => {
        selectedMemory = memory;
        openPopup(memory);
    });

    // CLICK = open popup
    ball.addEventListener("click", () => {

        const popup = document.getElementById("memoryPopup");

        document.getElementById("popupTitle").textContent = memory.title;
        document.getElementById("popupEmotion").textContent = memory.emotion;
        document.getElementById("popupDescription").textContent = memory.description;
        document.getElementById("popupNotes").textContent = memory.notes;

        popup.classList.remove("hidden");
    });
}
// CREATE MEMORY BALL + memory, saves to firebase and then calls create a ball

const accept = document.getElementById("accept");

if (accept) {
    accept.addEventListener("click", async () => {

        menu.classList.add("hidden");

        const user = auth.currentUser;
        if (!user) return;

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const notes = document.getElementById("notes").value;
        const emotion = document.getElementById("emotion").value;

        const memory = {
            uid: user.uid,
            title,
            description,
            notes,
            emotion,
            x: 0,
            y: 0,
            createdAt: new Date()
        };

        try {
            // Save to Firebase
            const docRef = await addDoc(
                collection(db, "users", user.uid, "memories"),
                memory
            );

            memory.id = docRef.id;
            createBall(memory);

        } catch (error) {
            console.log("Error saving memory:", error);
        }

        placingBall = null;

        setTimeout(() => {
            canPlace = true;
        }, 100);
    });
}
// FOLLOW THE MOUSE


document.addEventListener("mousemove", (e) => {

    if (!placingBall) return;

    placingBall.style.left = e.clientX + "px";
    placingBall.style.top = e.clientY + "px";

});

// PLACE THE BALL


document.addEventListener("click", (e) => {

    if (!placingBall || !canPlace) return;

    placingBall.style.left = e.clientX + "px";
    placingBall.style.top = e.clientY + "px";

    placingBall = null;
    canPlace = false;

});

const closeMenu = document.getElementById("closeMenu");

if (closeMenu) {
    closeMenu.addEventListener("click", () => {
        menu.classList.add("hidden");
    });
}

//Load memories
async function loadMemories() {

    const user = auth.currentUser;
    if (!user) return;

    const snapshot = await getDocs(
        collection(db, "users", user.uid, "memories")
    );

    snapshot.forEach((docSnap) => {

        const memory = docSnap.data();

        createBall(memory);
    });
}

onAuthStateChanged(auth, async (user) => {

    if (user) {
        await loadMemories();
    } else {
        window.location.href = "/LyxianWeb/Register-and-login/login.html";
    }
});


const closePopup = document.getElementById("closePopup");

if (closePopup) {
    closePopup.addEventListener("click", () => {
        document.getElementById("memoryPopup").classList.add("hidden");
    });
}

//Delete a ball

const deleteBtn = document.getElementById("deleteMemory");

deleteBtn.addEventListener("click", async () => {

    const user = auth.currentUser;
    if (!user || !selectedMemory) return;

    try {
        await deleteDoc(
            doc(db, "users", user.uid, "memories", selectedMemory.id)
        );

        // remove from screen
        document.querySelectorAll(".ballMemory").forEach(ball => {
            if (ball.dataset.id === selectedMemory.id) {
                ball.remove();
            }
        });

        selectedMemory = null;

        document.getElementById("memoryPopup").classList.add("hidden");

    } catch (error) {
        console.log("Delete error:", error);
    }
});