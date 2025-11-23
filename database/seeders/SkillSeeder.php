<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [
            // Artificial Intelligence & Machine Learning
            "Artificial Intelligence",
            "Machine Learning",
            "Deep Learning",
            "Neural Networks",
            "Computer Vision",
            "Natural Language Processing",
            "Predictive Analytics",
            "Reinforcement Learning",
            "Data Mining",

            // Data & Database
            "Data Science",
            "Data Engineering",
            "Big Data",
            "Data Visualization",
            "Data Warehouse",
            "SQL",
            "NoSQL",
            "PostgreSQL",
            "MySQL",
            "MongoDB",
            "Redis",

            // Web Development
            "HTML",
            "CSS",
            "JavaScript",
            "TypeScript",
            "ReactJS",
            "VueJS",
            "Angular",
            "NextJS",
            "NuxtJS",
            "NodeJS",
            "ExpressJS",
            "Laravel",
            "CodeIgniter",
            "Django",
            "Flask",
            "ASP .NET Core",
            "REST API",
            "GraphQL",

            // Mobile Development
            "Android (Kotlin)",
            "Android (Java)",
            "Flutter",
            "React Native",
            "Swift iOS",

            // Cloud Computing & DevOps
            "Cloud Computing",
            "Amazon Web Services",
            "Google Cloud Platform",
            "Microsoft Azure",
            "Linux Server",
            "Docker",
            "Kubernetes",
            "CI/CD",
            "Ansible",
            "Terraform",

            // Cyber Security
            "Cyber Security",
            "Penetration Testing",
            "Network Security",
            "Web Security",
            "Forensics",
            "Cryptography",
            "Incident Response",
            "Reverse Engineering",
            "Ethical Hacking",

            // Networking & Infrastructure
            "Computer Networks",
            "Cisco",
            "Mikrotik",
            "Routing & Switching",
            "SDN",
            "Network Monitoring",

            // Embedded Systems & Robotics
            "Embedded Systems",
            "Internet of Things",
            "Robotics",
            "Microcontroller (Arduino)",
            "STM32",
            "Raspberry Pi",
            "FPGA",
            "ROS",
            "Mechatronics",
            "Industrial Automation",

            // Game Development
            "Game Development",
            "Unity",
            "Unreal Engine",
            "Blender (3D)",
            "Game Design",

            // Software Engineering
            "Software Architecture",
            "Design Patterns",
            "Agile Development",
            "SCRUM",
            "UML",
            "Version Control (Git)",

            // UI/UX
            "UI/UX Design",
            "Wireframing",
            "Figma",
            "Prototyping",
            "Human-Computer Interaction",

            // Business & IT Management
            "IT Project Management",
            "Business Intelligence",
            "System Analysis",
            "Digital Transformation",

            // Competitive Programming
            "Data Structure & Algorithms",
            "Competitive Programming",
            "Mathematical Programming",
            "Capture The Flag",

            // Sains Terapan
            "Scientific Computing",
            "Simulation & Modeling",
        ];

        foreach ($skills as $skill) {
            Skill::create([
                'name' => $skill,
            ]);
        }
    }
}
