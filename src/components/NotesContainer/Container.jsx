import "./Container.scss";
import Note from "../Notes/Note";
import add from "../../assets/add.svg";
import { useEffect, useState } from "react";
import ModalView from "../Modal/ModalView";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
const Container = () => {
    const [notes, setNotes] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [forceRerender, setForceRerender] = useState(false);
    const [type, setType] = useState("edit");
    const [loading, setLoading] = useState(false);

    const handleOpenModal = (data) => {
        setOpenModal(true);
        setType(data);
    };
    const fetchNotes = async () => {
        setLoading(true);
        const userId = localStorage.getItem("user");
        const db = getFirestore();
        const notesSnapshot = await getDocs(query(collection(db, "notes"), where("userId", "==", userId)));

        const notesData = [];
        notesSnapshot.forEach((doc) => {
            const noteData = {
                id: doc.id,
                title: doc.data().title || "",
                description: doc.data().description || "",
                color: doc.data().color || "",
                createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
            };
            noteData.formattedCreatedAt = noteData.createdAt.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            notesData.push(noteData);
        });
        setNotes(notesData);
        setLoading(false);
    };

    useEffect(() => {
        fetchNotes();
    }, [forceRerender]);
    return (
        <section className="notes-container">
            {notes
                .slice()
                .reverse()
                .map((note) => (
                    <Note
                        key={note.id}
                        noteId={note.id}
                        title={note.title}
                        description={note.description}
                        color={note.color}
                        createdAt={note.formattedCreatedAt}
                        type={type}
                        setType={setType}
                        onNoteUpdate={() => setForceRerender((prev) => !prev)}
                    />
                ))}
            <motion.img
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 9 }}
                className="add"
                src={add}
                alt="add"
                onClick={() => handleOpenModal("add")}
            />
            <ModalView
                setOpenModal={setOpenModal}
                openModal={openModal}
                type={type}
                onNoteUpdate={() => setForceRerender((prev) => !prev)}
            />
            {notes.length == 0 && <h1 className="text-white">{loading ? "Loading..." : "No Notes Yet!"}</h1>}
        </section>
    );
};

export default Container;
