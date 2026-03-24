policies = []
policy_id = 1

def create_policy_service(policy):
    global policy_id

    new_policy = {
        "id": policy_id,
        **policy.dict()
    }

    policies.append(new_policy)
    policy_id += 1

    return new_policy