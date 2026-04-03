import { useState, useCallback } from 'react';
import Hero from './components/Hero';
import Calculator from './components/Calculator';
import CTA from './components/CTA';
import FilterModal from './components/FilterModal';
import Footer from './components/Footer';

const INITIAL_INPUTS = {
  serviceName: '',
  servicePrice: 400,
  margin: 65,
  clientsPerMonth: 5,
};

export default function App() {
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = useCallback((key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <Hero />
      <Calculator inputs={inputs} onChange={handleChange} />
      <CTA inputs={inputs} onOpenModal={openModal} />
      <Footer />
      <FilterModal isOpen={isModalOpen} onClose={closeModal} inputs={inputs} />
    </>
  );
}
