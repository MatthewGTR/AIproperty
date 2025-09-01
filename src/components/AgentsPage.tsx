import React from 'react';
import { X, Phone, Mail, MapPin, Star, Award, TrendingUp, Users } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  image: string;
  location: string;
  experience: string;
  specialization: string[];
  rating: number;
  reviews: number;
  propertiesSold: number;
  languages: string[];
  description: string;
  achievements: string[];
}

interface AgentsPageProps {
  onClose: () => void;
}

const AgentsPage: React.FC<AgentsPageProps> = ({ onClose }) => {
  const topAgents: Agent[] = [
    {
      id: '1',
      name: 'Dr. Amelia Tan',
      title: 'Senior Property Consultant',
      phone: '+60 12-888-9999',
      email: 'amelia@eliterealty.my',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=300',
      location: 'Kuala Lumpur & Selangor',
      experience: '12 years',
      specialization: ['Luxury Properties', 'Investment Properties', 'Commercial Real Estate'],
      rating: 4.9,
      reviews: 156,
      propertiesSold: 280,
      languages: ['English', 'Mandarin', 'Bahasa Malaysia'],
      description: 'Dr. Amelia Tan is a highly experienced property consultant specializing in luxury and investment properties across KL and Selangor. With a PhD in Real Estate Economics, she provides data-driven insights to help clients make informed decisions.',
      achievements: [
        'Top Performer 2023 - Elite Realty',
        'Certified Property Investment Advisor',
        'Real Estate Excellence Award 2022',
        'Over RM50M in property transactions'
      ]
    },
    {
      id: '2',
      name: 'Ahmad Rahman',
      title: 'Property Investment Specialist',
      phone: '+60 12-345-6789',
      email: 'ahmad@malaysiarealty.com',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
      location: 'KLCC & Mont Kiara',
      experience: '8 years',
      specialization: ['High-Rise Condos', 'KLCC Properties', 'Expat Housing'],
      rating: 4.8,
      reviews: 124,
      propertiesSold: 195,
      languages: ['English', 'Bahasa Malaysia', 'Arabic'],
      description: 'Ahmad specializes in premium high-rise properties in KLCC and Mont Kiara. His expertise in the expat market and deep knowledge of luxury developments make him the go-to agent for international clients.',
      achievements: [
        'KLCC Specialist Certification',
        'Top 10 Agent - Malaysia Realty 2023',
        'Expat Housing Expert',
        'Customer Service Excellence Award'
      ]
    },
    {
      id: '3',
      name: 'Siti Nurhaliza',
      title: 'Residential Property Expert',
      phone: '+60 17-234-5678',
      email: 'siti@johorrealty.com',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
      location: 'Johor Bahru & Iskandar',
      experience: '10 years',
      specialization: ['Landed Properties', 'Family Homes', 'New Developments'],
      rating: 4.9,
      reviews: 189,
      propertiesSold: 245,
      languages: ['Bahasa Malaysia', 'English', 'Hokkien'],
      description: 'Siti is Johor\'s most trusted residential property expert with extensive knowledge of Taman Daya, Iskandar Puteri, and surrounding areas. She helps families find their perfect homes with personalized service.',
      achievements: [
        'Johor Top Agent 2022 & 2023',
        'Family Housing Specialist',
        'New Development Launch Expert',
        'Community Choice Award Winner'
      ]
    },
    {
      id: '4',
      name: 'Lim Wei Ming',
      title: 'Heritage & Tourism Property Consultant',
      phone: '+60 16-345-6789',
      email: 'lim@penanghomes.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
      location: 'Georgetown & Penang Island',
      experience: '15 years',
      specialization: ['Heritage Properties', 'Tourism Investment', 'Penang Specialist'],
      rating: 4.7,
      reviews: 98,
      propertiesSold: 167,
      languages: ['English', 'Mandarin', 'Hokkien', 'Bahasa Malaysia'],
      description: 'Wei Ming is Penang\'s heritage property specialist with deep knowledge of Georgetown\'s UNESCO World Heritage area. He helps investors and homeowners navigate the unique regulations and opportunities in heritage zones.',
      achievements: [
        'UNESCO Heritage Property Expert',
        'Penang Tourism Board Advisor',
        'Heritage Conservation Award',
        '15 Years Penang Market Experience'
      ]
    },
    {
      id: '5',
      name: 'Catherine Lee',
      title: 'Luxury Property Director',
      phone: '+60 12-456-7890',
      email: 'catherine@pjluxury.com',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
      location: 'Petaling Jaya & Damansara',
      experience: '14 years',
      specialization: ['Luxury Bungalows', 'Premium Condos', 'High-Net-Worth Clients'],
      rating: 4.9,
      reviews: 87,
      propertiesSold: 156,
      languages: ['English', 'Mandarin', 'Cantonese'],
      description: 'Catherine is the luxury property director specializing in high-end bungalows and premium condominiums in PJ and Damansara. She provides white-glove service to discerning clients seeking exceptional properties.',
      achievements: [
        'Luxury Property Specialist Certification',
        'RM100M+ in Luxury Sales',
        'VIP Client Service Award',
        'Damansara Heights Expert'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Our Top Agents</h2>
            <p className="text-gray-600">Meet Malaysia's most trusted property experts</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Agents Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {topAgents.map((agent) => (
              <div key={agent.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                {/* Agent Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                    <p className="text-blue-600 font-medium">{agent.title}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(agent.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {agent.rating} ({agent.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{agent.propertiesSold}</div>
                    <div className="text-xs text-gray-600">Properties Sold</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{agent.experience}</div>
                    <div className="text-xs text-gray-600">Experience</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{agent.reviews}</div>
                    <div className="text-xs text-gray-600">Happy Clients</div>
                  </div>
                </div>

                {/* Location & Languages */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{agent.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {agent.languages.map((lang) => (
                      <span key={lang} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specialization */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Specialization</h4>
                  <div className="flex flex-wrap gap-2">
                    {agent.specialization.map((spec) => (
                      <span key={spec} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-600 text-sm leading-relaxed">{agent.description}</p>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Achievements</h4>
                  <ul className="space-y-1">
                    {agent.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Award className="h-3 w-3 text-yellow-500 mr-2 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </button>
                  <button className="flex-1 flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;