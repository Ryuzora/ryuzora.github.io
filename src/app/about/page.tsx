import type { Metadata } from 'next';
import AboutContent from './about';

export const metadata: Metadata = {
  title: 'About | The Throne',
  description: 'Learn more about the writer behind The Throne.',
};

export default function AboutPage() {
  return <AboutContent />;
}

