import Modal from "react-bootstrap/Modal";
import "./Modal.scss";
import { colors } from "../../constants";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../config/firebase";
import { getFirestore, collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { PacmanLoader } from "react-spinners";
import { useAuth } from "../../config/AuthContext";
import { motion } from "framer-motion";

export default function ModalView({ openModal, setOpenModal, type, note, onNoteUpdate }) {
    initializeApp(firebaseConfig);
    const [loading, setLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { user } = useAuth();
    const userId = localStorage.getItem("user");
    const handleClose = () => {
        setOpenModal((prev) => !prev);
    };
    const handleBgColor = (color) => {
        setSelectedColor(color);
    };
    const handleUpdate = async () => {
        if (!title) {
            alert("Please Enter the Title");
            return;
        }
        if (!description) {
            alert("Please Enter the Description");
            return;
        }

        const db = getFirestore();
        setLoading(true);
        const noteRef = doc(db, "notes", note?.noteId);

        try {
            await updateDoc(noteRef, {
                title: title,
                description: description,
            });
            setLoading(false);
            handleClose();
            setTitle("");
            setDescription("");
            setSelectedColor(null);
            onNoteUpdate();
        } catch (error) {
            handleClose();
            console.error("Error updating note color:", error);
        }
    };
    const handleSubmit = async () => {
        if (!title) {
            alert("Please Enter the Title");
            return;
        }
        if (!description) {
            alert("Please Enter the Description");
            return;
        }
        if (!selectedColor) {
            alert("Please choose a color");
            return;
        }

        const db = getFirestore();
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "notes"), {
                title: title,
                description: description,
                color: selectedColor,
                userId: user?.uid || userId,
                timestamp: new Date(),
            });
            if (docRef.id) {
                onNoteUpdate();
                setLoading(false);
                handleClose();
                setTitle("");
                setDescription("");
                setSelectedColor(null);
            }

            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            setLoading(false);
            handleClose();
            console.error("Error adding document: ", e);
        }
    };
    useEffect(() => {
        if (type === "edit" && note) {
            setTitle(note.title || "");
            setDescription(note.description || "");
        }
    }, [type, note]);

    return (
        <Modal show={openModal} onHide={handleClose}>
            <Modal.Body>
                <label htmlFor="title" className="lg-text py-1">
                    Title
                </label>

                {type == "edit" ? (
                    <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
                ) : (
                    <input type="text" onChange={(e) => setTitle(e.target.value)} />
                )}
                <label htmlFor="description" className="lg-text py-1">
                    Description
                </label>
                {type == "edit" ? (
                    <textarea
                        name="description"
                        id="description"
                        cols="30"
                        rows="5"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    ></textarea>
                ) : (
                    <textarea
                        name="description"
                        id="description"
                        cols="30"
                        rows="5"
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                )}
                {type == "add" && (
                    <>
                        <label htmlFor="color" className="lg-text">
                            Choose
                        </label>
                        <div
                            className="position-relative"
                            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <ul style={{ display: "flex", flexDirection: "row", paddingLeft: "0" }}>
                                {colors.map((color, index) => (
                                    <motion.span
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 9 }}
                                        className="mx-1"
                                        key={index}
                                        style={{
                                            borderRadius: "50%",
                                            display: "flex",
                                            height: "28px",
                                            width: "28px",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor:
                                                selectedColor &&
                                                selectedColor.color1 === color.color1 &&
                                                selectedColor.color2 === color.color2
                                                    ? "#ffffff"
                                                    : "transparent",
                                        }}
                                    >
                                        <li
                                            style={{
                                                background: `linear-gradient(45deg, #${color.color1},#${color.color2})`,
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                listStyle: "none",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleBgColor(color)}
                                        />
                                    </motion.span>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
                <PacmanLoader cssOverride={{ position: "absolute", bottom: "1rem" }} loading={loading} color="#9EC8B9" />
                <button onClick={type == "edit" ? handleUpdate : handleSubmit} className="button modalButton mt-2">
                    Add
                </button>
            </Modal.Body>
        </Modal>
    );
}
