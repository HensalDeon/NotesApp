import "./Note.scss";
import colori from "../../assets/color.svg";
import edit from "../../assets/edit.svg";
import delt from "../../assets/delete.svg";
import { colors } from "../../constants";
import { useState } from "react";
import PropTypes from "prop-types";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import ModalView from "../Modal/ModalView";
import { PacmanLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

const Note = ({ noteId, title, description, color, createdAt, type, setType, onNoteUpdate }) => {
    const [listOpen, SetListOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const note = { noteId: noteId, title: title, description: description, color: color };
    const handleBgColor = async (color) => {
        const bg = document.querySelector(`.note[data-id="${noteId}"]`);
        bg.style.background = `linear-gradient(45deg, #${color.color1}, #${color.color2})`;
        const db = getFirestore();
        const noteRef = doc(db, "notes", noteId);

        try {
            await updateDoc(noteRef, {
                color: color,
            });
        } catch (error) {
            console.error("Error updating note color:", error);
        }
        SetListOpen(false);
    };

    const handleEdit = () => {
        setOpenModal(true);
        setType("edit");
    };

    const handleDelete = async () => {
        const db = getFirestore();
        const noteRef = doc(db, "notes", noteId);
        setLoading(true);
        try {
            await deleteDoc(noteRef);
            onNoteUpdate();
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };
    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: -100, y: -100, opacity: 0, transition: { type: "spring", duration: 0.8 } }}
                animate={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    transition: { type: "spring", duration: 0.8, delay: 0 },
                }}
                exit={{ x: -100, y: -100, opacity: 0, transition: { type: "spring", duration: 0.8 } }}
                className="note"
                data-id={noteId}
                style={{ background: `linear-gradient(45deg, #${color.color1},#${color.color2})` }}
            >
                <motion.div
                    className="note-data"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                        type: "spring",
                        damping: 5,
                        stiffness: 40,
                        restDelta: 0.001,
                        duration: 0.3,
                    }}
                >
                    <div className="note-head">
                        <h5>{title}</h5>
                        <b>{createdAt}</b>
                    </div>
                    <div>{description}</div>
                    <div className="note-btm">
                        <div className="options">
                            <motion.img
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 9 }}
                                src={colori}
                                onClick={() => SetListOpen((prev) => !prev)}
                                alt="color"
                            />
                            <motion.img
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 9 }}
                                src={delt}
                                onClick={() => handleDelete()}
                                alt="delete"
                            />
                            <motion.img
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 9 }}
                                src={edit}
                                onClick={() => handleEdit()}
                                alt="edit"
                            />
                            {listOpen && (
                                <motion.div
                                    className="colors"
                                    initial={{ x: 70, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        damping: 6,
                                        stiffness: 40,
                                        restDelta: 0.001,
                                        duration: 0.3,
                                    }}
                                    exit={{ x: -100, y: -100, opacity: 0, transition: { type: "spring", duration: 0.8 } }}
                                >
                                    <ul>
                                        {colors.map((color, index) => (
                                            <motion.li
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                key={index}
                                                style={{
                                                    background: `linear-gradient(45deg, #${color.color1},#${color.color2})`,
                                                }}
                                                onClick={() => handleBgColor(color)}
                                            />
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>

                <PacmanLoader
                    cssOverride={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        margin: "auto",
                    }}
                    loading={loading}
                    color="#9EC8B9"
                />
                <ModalView
                    setOpenModal={setOpenModal}
                    openModal={openModal}
                    type={type}
                    note={note}
                    onNoteUpdate={onNoteUpdate}
                />
            </motion.div>
        </AnimatePresence>
    );
};

Note.propTypes = {
    noteId: PropTypes.string.isRequired,
};

export default Note;
