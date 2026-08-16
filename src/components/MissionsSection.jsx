import { motion } from 'framer-motion';

const MISSIONS = [
    {
        title: "Sứ mệnh 1",
        main: "Giữ cái hồn của nghề thủ công Việt",
        desc: "Để những giá trị được truyền qua đôi tay không biến mất theo thời gian.",
        color: "bg-teal-50 border-teal-100 text-teal-800"
    },
    {
        title: "Sứ mệnh 2",
        main: "Kể chuyện di sản bằng ngôn ngữ mới",
        desc: "Đưa mây tre Phú Vinh đến gần hơn với thế hệ hôm nay.",
        color: "bg-amber-50 border-amber-100 text-amber-800"
    },
    {
        title: "Sứ mệnh 3",
        main: "Nối người trẻ với làng nghề",
        desc: "Biến sự tò mò thành thấu hiểu, và thấu hiểu thành trân trọng.",
        color: "bg-purple-50 border-purple-100 text-purple-800"
    },
    {
        title: "Sứ mệnh 4",
        main: "Đưa công nghệ phục vụ văn hóa",
        desc: "Để AI không thay thế truyền thống, mà giúp truyền thống được lan xa hơn.",
        color: "bg-cyan-50 border-cyan-100 text-cyan-800"
    },
    {
        title: "Sứ mệnh 5",
        main: "Để Phú Vinh được nhớ, được yêu và tiếp nối",
        desc: "Không chỉ như một làng nghề, mà như một phần sống động của bản sắc Việt.",
        color: "bg-rose-50 border-rose-100 text-rose-800",
        colSpan: true
    }
];

export default function MissionsSection() {
    return (
        <section className="py-24 bg-slate-50 relative">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                            Để làm gì?
                        </h2>
                        <p className="text-lg text-slate-600">
                            5 sứ mệnh cốt lõi xuyên suốt mọi hoạt động của chúng tôi.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {MISSIONS.map((mission, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 rounded-[2rem] border ${mission.color} ${mission.colSpan ? 'md:col-span-2 text-center' : ''}`}
                        >
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-70">
                                {mission.title}
                            </h3>
                            <h4 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">
                                {mission.main}
                            </h4>
                            <p className="text-lg opacity-80 leading-relaxed font-light">
                                {mission.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
