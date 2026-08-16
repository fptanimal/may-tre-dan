import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Leaf, Compass, HelpCircle, BookOpen, ArrowRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import DefinitionSection from '../components/DefinitionSection';
import MissionsSection from '../components/MissionsSection';
import FeaturesSection from '../components/FeaturesSection';
import StatsSection from '../components/StatsSection';

export default function Home() {
    return (
        <div className="bg-white">
            <HeroSection />
            <DefinitionSection />
            <MissionsSection />
            <FeaturesSection />
            <StatsSection />
        </div>
    );
}