import { useEffect, useState, useCallback } from 'react';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import About from '../components/About';
import Speakers from '../components/Speakers';
import ProgramList from '../components/ProgramList';
import Venue from '../components/Venue';
import RegisterCta from '../components/RegisterCta';

import ClosingBand from '../components/ClosingBand';
import Footer from '../components/Footer';
import { loadConfig, DEFAULT_CONFIG } from '../lib/config';
import { countRegistrations } from '../lib/registrations';

export default function EventPage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [registeredCount, setRegisteredCount] = useState(null);

  const refreshCount = useCallback(async () => {
    const count = await countRegistrations();
    setRegisteredCount(count);
  }, []);

  useEffect(() => {
    loadConfig().then(setConfig);
    refreshCount();
  }, [refreshCount]);

  return (
    <>
      <Nav />
      <Hero config={config} registeredCount={registeredCount} />
      <Speakers />
      <About />
      <ProgramList />
      <Venue config={config} />
      <RegisterCta registeredCount={registeredCount} />
      <ClosingBand />
      <Footer />
    </>
  );
}
