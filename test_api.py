import requests


def chat_stream():
    domain = 'http://localhost:8080/'
    request = 'regulation/chat_stream/'

    url = domain + request
    print(url)

    user_input = {
        "regulations": [
            "dora"
        ],
        "chat_history": [
            {
                "sender": "Rudan",
                "message": "What are the key responsibilities and requirements for financial entities, excluding "
                           "microenterprises, in identifying, assessing, and managing ICT risks and assets as "
                           "outlined in the ICT risk management framework?"
            },
            {
                "sender": "agent",
                "message": "The key responsibilities and requirements for financial entities, excluding microenterprises, in identifying, assessing, and managing ICT risks and assets as outlined in the ICT risk management framework can be grounded in several articles from the regulatory framework provided. Here are the relevant articles and a summary of their contents:\n\n1. **Article 1 - Subject Matter**\n   - Focus on ensuring a high common level of digital operational resilience through uniform requirements for ICT risk management, among others (Article 1(1)(a)).\n\n2. **Article 4 - Proportionality Principle**\n   - Financial entities must implement rules in Chapter II proportionate to their size, overall risk profile, and complexity of their services (Article 4(1)).\n\n3. **Article 5 - Governance and Organisation**\n   - Establish an internal governance and control framework to manage ICT risk effectively (Articles 5(1) and 5(2)).\n   - Define roles, responsibilities, and ensure regular ICT security awareness training and periodic review of ICT policies (Articles 5(2)(h), 5(3), and 5(4)).\n\n4. **Article 6 - ICT Risk Management Framework**\n   - Develop a comprehensive and well-documented ICT risk management framework encompassing strategies, policies, procedures, protocols, and tools (Article 6(1)-(2)).\n   - Continuous improvement and yearly review of the framework (Article 6(5)).\n   - Assign responsibility for ICT risk management to an independent control function and ensure the segregation of responsibilities (Articles 6(4) and 6(6)).\n   - Establish a digital operational resilience strategy, outlining clear ICT risk management objectives and methods (Article 6(8)).\n\n5. **Article 7 - ICT Systems, Protocols, and Tools**\n   - Maintain updated ICT systems that are reliable, resilient, and have sufficient capacity to manage operations (Article 7).\n\n6. **Article 8 - Identification**\n   - Document all ICT-supported business functions, roles, information and ICT assets, and regularly review this documentation (Articles 8(1)-(2)).\n   - Perform risk assessments upon major changes affecting ICT-supported functions (Article 8(3)).\n   - Maintain relevant inventories of information and ICT assets and assess dependencies on ICT third-party providers (Articles 8(4)-(6)).\n\n7. **Article 9 - Protection and Prevention**\n   - Implement ICT security policies and continuously monitor and control ICT systems to minimize risk impact (Articles 9(1)-(2)).\n   - Design and implement ICT security measures to maintain high standards of data availability, integrity, and confidentiality (Article 9(3)).\n\n8. **Article 10 - Detection**\n   - Establish mechanisms to promptly detect ICT-related anomalies and incidents (Article 10(1)-(2)).\n\n9. **Article 11 - Response and Recovery**\n   - Develop and maintain an ICT business continuity policy, ensuring the continuity of critical functions and quick response to ICT-related incidents (Articles 11(1)-(4)).\n   - Conduct regular business impact analyses and testing of business continuity and recovery plans (Articles 11(5)-(6)).\n\n10. **Article 12 - Backup Policies and Procedures, Restoration and Recovery Procedures and Methods**\n   - Create comprehensive backup policies and ensure the timely restoration of ICT systems and data (Articles 12(1)-(3)).\n\n11. **Article 13 - Learning and Evolving**\n    - Conduct post ICT-related incident reviews and continually update ICT risk assessments based on lessons learned (Articles 13(1)-(3)).\n    - Develop and implement ICT security awareness programs and ensure staff and ICT third-party providers are trained appropriately (Articles 13(6)-(7)).\n\n12. **Article 14 - Communication**\n    - Set up crisis communication plans to manage the disclosure of major ICT-related incidents to stakeholders (Articles 14(1)-(2)).\n\nThese articles collectively outline the requirements for a robust ICT risk management framework, emphasizing continuous monitoring, assessment, and improvement, alongside clear governance and risk management policies."
            },
            {
                "sender": "Rudan",
                "message": "Translate this into Swedish."
            }
        ]
    }

    def get_json_events_sync():
        with requests.put(url, json=user_input, stream=True) as r:
            for line in r.iter_lines():
                yield line

    for event in get_json_events_sync():
        print(event.decode("utf-8"))


if __name__ == '__main__':
    chat_stream()